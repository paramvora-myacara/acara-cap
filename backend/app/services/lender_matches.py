from app.models.models import Lender, User
from app import db
from sqlalchemy import cast, String, func, and_, or_
import json

def get_preliminary_matches(): # Removed parameters to get all lenders
    """
    Get all lenders for preliminary matching.

    Returns:
        dict: Result containing list of lenders, message, and success status
    """
    try:
        # Query the database for all lenders
        lenders = db.session.query(Lender).join(User).filter(
            User.role == 'lender',
        ).all()

        return {
            'lenders': lenders, # Return the list of lender objects
            'message': "Lenders fetched successfully",
            'success': True
        }
    except Exception as e:
        print(f"Error getting lenders: {str(e)}")
        return {
            'lenders': [],
            'message': "Error fetching lenders. Please try again.",
            'success': False
        }


def calculate_match_score(project, lender):
    """
    Calculate a match score between a project and a lender.
    Higher score means better match.

    Args:
        project: Project model instance
        lender: Lender model instance

    Returns:
        float: Match score between 0 and 100
    """
    criteria = lender.lending_criteria
    score = 0
    total_weight = 0

    # Asset type match (weight: 20)
    weight = 20
    total_weight += weight
    if 'asset_types' in criteria and project.asset_type in criteria['asset_types']:
        score += weight

    # Deal type match (weight: 15)
    weight = 15
    total_weight += weight
    if 'deal_types' in criteria and project.deal_type in criteria['deal_types']:
        score += weight

    # Capital type match (weight: 15)
    weight = 15
    total_weight += weight
    if 'capital_types' in criteria and project.capital_type in criteria['capital_types']:
        score += weight

    # Loan amount range (weight: 25)
    weight = 25
    total_weight += weight
    loan_amount_score = 0
    if 'min_loan_amount' in criteria and 'max_loan_amount' in criteria:
        min_amount = criteria['min_loan_amount']
        max_amount = criteria['max_loan_amount']
        if min_amount <= project.debt_request <= max_amount:
            # Calculate how centered the request is in the lender's range
            range_width = max_amount - min_amount
            if range_width > 0:
                position = (project.debt_request - min_amount) / range_width
                # Score is highest (100%) when in the middle of the range
                center_score = 1 - abs(0.5 - position) * 2
                loan_amount_score = weight * center_score
            else:
                loan_amount_score = weight * 0.5  # Just a middle score if range is 0
        else:
            # Out of range, but calculate how close
            if project.debt_request < min_amount:
                # Score reduces as you get further below min
                ratio = project.debt_request / min_amount
                loan_amount_score = weight * max(0, ratio * 0.5)  # Max 50% if below
            else:  # project.debt_request > max_amount
                # Score reduces as you get further above max
                ratio = max_amount / project.debt_request
                loan_amount_score = weight * max(0, ratio * 0.5)  # Max 50% if above
    score += loan_amount_score

    # Location match (weight: 15)
    weight = 15
    total_weight += weight
    location_score = 0
    if 'locations' in criteria:
        for lender_location in criteria['locations']:
            if lender_location.lower() in project.project_address.lower():
                location_score = weight
                break
    score += location_score

    # LTV ratio (weight: 10)
    weight = 10
    total_weight += weight
    ltv_score = 0
    if 'loan_to_value' in criteria:
        project_ltv = (float(project.debt_request) / float(project.completed_value)) * 100
        lender_max_ltv = criteria['loan_to_value']
        if project_ltv <= lender_max_ltv:
            # Score higher when LTV is optimal for lender
            ltv_ratio = project_ltv / lender_max_ltv
            # Optimal is around 80-90% of max LTV
            if 0.8 <= ltv_ratio <= 0.9:
                ltv_score = weight
            else:
                # Linear falloff as you move away from optimal
                ltv_score = weight * (1 - min(1, abs(0.85 - ltv_ratio) * 5))
        else:
            # LTV too high, score is 0
            ltv_score = 0
    score += ltv_score

    # Calculate percentage score
    if total_weight > 0:
        percentage_score = (score / total_weight) * 100
    else:
        percentage_score = 0

    return round(percentage_score, 1)