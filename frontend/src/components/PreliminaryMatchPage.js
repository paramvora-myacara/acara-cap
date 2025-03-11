import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Container
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPreliminaryMatches } from '../services/api';


const DEBT_RANGES = [
    { label: '$0 - $5M', min: 0, max: 5000000 },
    { label: '$5M - $10M', min: 5000000, max: 10000000 },
    { label: '$10M - $15M', min: 10000000, max: 15000000 },
    { label: '$15M+', min: 15000000, max: Infinity }
];

const PreliminaryMatchPage = () => {
    const [lenders, setLenders] = useState([]);
    const [filteredLenders, setFilteredLenders] = useState([]);
    const [filters, setFilters] = useState({
        asset_types: [],
        deal_types: [],
        capital_types: [],
        debt_ranges: [],
        custom_min_debt_request: '',
        custom_max_debt_request: '',
        locations: []
    });

    // Unique filter options extracted from lenders
    const [filterOptions, setFilterOptions] = useState({
        asset_types: [],
        deal_types: [],
        capital_types: [],
        locations: []
    });

    useEffect(() => {
        const fetchLenders = async () => {
            try {
                const data = await getPreliminaryMatches();
                if (data && data.success) {
                    setLenders(data.lenders);
                    extractFilterOptions(data.lenders);
                    applyFilters(data.lenders, filters);
                } else {
                    console.error("Failed to fetch lenders:", data ? data.message : 'Unknown error');
                }
            } catch (error) {
                console.error("Error fetching lenders:", error);
            }
        };

        fetchLenders();
    }, []);

    const extractFilterOptions = (lendersList) => {
        const options = {
            asset_types: new Set(),
            deal_types: new Set(),
            capital_types: new Set(),
            locations: new Set()
        };

        lendersList.forEach(lender => {
            const criteria = lender.lending_criteria;
            criteria.asset_types?.forEach(type => options.asset_types.add(type));
            criteria.deal_types?.forEach(type => options.deal_types.add(type));
            criteria.capital_types?.forEach(type => options.capital_types.add(type));
            criteria.locations?.forEach(loc => options.locations.add(loc));
        });

        setFilterOptions({
            asset_types: Array.from(options.asset_types),
            deal_types: Array.from(options.deal_types),
            capital_types: Array.from(options.capital_types),
            locations: Array.from(options.locations)
        });
    };

    const handleFilterChange = (category, value) => {
        const updatedFilters = { ...filters };

        // Toggle checkbox for array-based filters
        if (['asset_types', 'deal_types', 'capital_types', 'locations', 'debt_ranges'].includes(category)) {
            const currentIndex = updatedFilters[category].indexOf(value);
            const newChecked = [...updatedFilters[category]];

            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }

            updatedFilters[category] = newChecked;
        }
        // Handle numeric inputs for debt request
        else if (category === 'custom_min_debt_request' || category === 'custom_max_debt_request') {
            updatedFilters[category] = value;
        }

        setFilters(updatedFilters);
        applyFilters(lenders, updatedFilters);
    };

    const applyFilters = (currentLenders, currentFilters) => {
        const filtered = currentLenders.filter(lender => {
            const criteria = lender.lending_criteria;

            // Check Asset Types
            if (currentFilters.asset_types.length > 0 &&
                !currentFilters.asset_types.some(type =>
                    criteria.asset_types?.includes(type))) {
                return false;
            }

            // Check Deal Types
            if (currentFilters.deal_types.length > 0 &&
                !currentFilters.deal_types.some(type =>
                    criteria.deal_types?.includes(type))) {
                return false;
            }

            // Check Capital Types
            if (currentFilters.capital_types.length > 0 &&
                !currentFilters.capital_types.some(type =>
                    criteria.capital_types?.includes(type))) {
                return false;
            }

            // Check Locations
            if (currentFilters.locations.length > 0 &&
                !currentFilters.locations.some(loc =>
                    criteria.locations?.includes(loc))) {
                return false;
            }

            // Check Predefined Debt Ranges
            const lenderMaxLoan = criteria.max_loan_amount || 0;
            const lenderMinLoan = criteria.min_loan_amount || 0;

            // Check Predefined Ranges
            if (currentFilters.debt_ranges.length > 0) {
                const matchesRange = currentFilters.debt_ranges.some(rangeLabel => {
                    const range = DEBT_RANGES.find(r => r.label === rangeLabel);
                    return range &&
                        lenderMaxLoan >= range.min &&
                        lenderMinLoan <= range.max;
                });
                if (!matchesRange) return false;
            }

            // Check Custom Debt Range
            const minDebt = parseFloat(currentFilters.custom_min_debt_request || 0);
            const maxDebt = parseFloat(currentFilters.custom_max_debt_request || Infinity);

            if (minDebt > lenderMaxLoan || maxDebt < lenderMinLoan) {
                return false;
            }

            return true;
        });

        setFilteredLenders(filtered);
    };

    const prepareLenderChartData = () => {
        return filteredLenders.map(lender => ({
            name: lender.user.company_name,
            loan: lender.lending_criteria.max_loan_amount || 0
        }));
    };

    const handleLenderClick = (lender) => {
        // TODO: Implement introduction or detailed view
        alert(`Lender ${lender.user.company_name} clicked! Redirect to registration.`);
    };

    return (
        <Container maxWidth="xl" sx={{ display: 'flex', height: '100vh', pt: 4 }}>
            {/* Filters Section */}
            <Box
                sx={{
                    width: '30%',
                    pr: 4,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    overflowY: 'auto'
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Lender Filters
                </Typography>

                {/* Asset Types Filter */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Asset Types</Typography>
                    <Grid container>
                        {filterOptions.asset_types.map(type => (
                            <Grid item xs={6} key={type}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.asset_types.includes(type)}
                                            onChange={() => handleFilterChange('asset_types', type)}
                                        />
                                    }
                                    label={type}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Deal Types Filter */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Deal Types</Typography>
                    <Grid container>
                        {filterOptions.deal_types.map(type => (
                            <Grid item xs={6} key={type}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.deal_types.includes(type)}
                                            onChange={() => handleFilterChange('deal_types', type)}
                                        />
                                    }
                                    label={type}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Capital Types Filter */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Capital Types</Typography>
                    <Grid container>
                        {filterOptions.capital_types.map(type => (
                            <Grid item xs={6} key={type}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.capital_types.includes(type)}
                                            onChange={() => handleFilterChange('capital_types', type)}
                                        />
                                    }
                                    label={type}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Locations Filter */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Locations</Typography>
                    <Grid container>
                        {filterOptions.locations.map(loc => (
                            <Grid item xs={6} key={loc}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.locations.includes(loc)}
                                            onChange={() => handleFilterChange('locations', loc)}
                                        />
                                    }
                                    label={loc}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Debt Ranges Filter */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Debt Ranges</Typography>
                    <Grid container>
                        {DEBT_RANGES.map(range => (
                            <Grid item xs={6} key={range.label}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.debt_ranges.includes(range.label)}
                                            onChange={() => handleFilterChange('debt_ranges', range.label)}
                                        />
                                    }
                                    label={range.label}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Custom Debt Request Range */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Custom Debt Range</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Min Debt"
                                variant="outlined"
                                value={filters.custom_min_debt_request}
                                onChange={(e) => handleFilterChange('custom_min_debt_request', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Max Debt"
                                variant="outlined"
                                value={filters.custom_max_debt_request}
                                onChange={(e) => handleFilterChange('custom_max_debt_request', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Lenders Section */}
            <Box
                sx={{
                    width: '70%',
                    pl: 4,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Potential Lenders ({filteredLenders.length})
                    </Typography>

                    {filteredLenders.length > 0 ? (
                        <>
                            <Box sx={{ height: '60%', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={prepareLenderChartData()}
                                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                                    >
                                        <XAxis dataKey="name" />
                                        <YAxis label={{ value: 'Max Loan Amount', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="loan"
                                            fill="#1976d2"
                                            onClick={(data, index) => handleLenderClick(filteredLenders[index])}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>

                            {/* Detailed Lender List */}
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {filteredLenders.map(lender => (
                                    <Grid item xs={6} key={lender.lender_id}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                    boxShadow: 3
                                                }
                                            }}
                                            onClick={() => handleLenderClick(lender)}
                                        >
                                            <Typography variant="h6">
                                                {lender.user.company_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Max Loan: ${lender.lending_criteria.max_loan_amount?.toLocaleString() || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {lender.lending_criteria.locations?.join(', ') || 'Multiple Locations'}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                No lenders found matching your criteria.
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default PreliminaryMatchPage;