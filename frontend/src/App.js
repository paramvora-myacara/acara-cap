import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PreliminaryMatchPage from './components/PreliminaryMatchPage'; // Import the new component
// ... other imports

function App() {
    return (
        <Router>
            <Routes>
                {/* ... other routes */}
                <Route path="/preliminary-match" element={<PreliminaryMatchPage />} /> {/* Add route for preliminary match page */}
                {/* ... other routes */}
            </Routes>
        </Router>
    );
}

export default App;