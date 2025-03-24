import json
from app.models.models import Lender
from app.models.models import Project


def calculate_match_score(project, lender):
    """
    Calculate a match score between a project and a lender.
    This is a simplified algorithm and would be more complex in a real application.

    Args:
        project: Project object
        lender: Lender object

    Returns:
        float: Match score between 0 and 1
    """
    score = 0
    total_criteria = 0

    # Get lender criteria
    lending_criteria = lender.get_lending_criteria()

    # Asset type match
    if 'asset_types' in lending_criteria and project.asset_type in lending_criteria['asset_types']:
        score += 1
    total_criteria += 1

    # Deal type match
    if 'deal_types' in lending_criteria and project.deal_type in lending_criteria['deal_types']:
        score += 1
    total_criteria += 1

    # Capital type match
    if 'capital_types' in lending_criteria and project.capital_type in lending_criteria['capital_types']:
        score += 1
    total_criteria += 1

    # Loan size match
    if 'min_loan_size' in lending_criteria and 'max_loan_size' in lending_criteria and project.debt_request:
        if lending_criteria['min_loan_size'] <= project.debt_request <= lending_criteria['max_loan_size']:
            score += 1
    total_criteria += 1

    # Calculate final score
    if total_criteria > 0:
        return score / total_criteria
    else:
        return 0


def find_matching_lenders(project, min_score=0.5):
    """
    Find lenders that match a project with a minimum score.

    Args:
        project: Project object
        min_score: Minimum match score (default: 0.5)

    Returns:
        list: List of tuples (lender, score) sorted by score in descending order
    """
    matches = []

    lenders = Lender.query.all()

    for lender in lenders:
        score = calculate_match_score(project, lender)
        if score >= min_score:
            matches.append((lender, score))

    # Sort by score in descending order
    matches.sort(key=lambda x: x[1], reverse=True)

    return matches

