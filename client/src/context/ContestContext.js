// client/src/context/ContestContext.js
import React, { createContext, useContext, useState, useReducer } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext.js';

// Create context
const ContestContext = createContext();

// Initial state
const initialState = {
    contests: [],
    filteredContests: [],
    bookmarkedContests: [],
    activeFilters: {
        platforms: ['codeforces', 'codechef', 'leetcode'],
        status: 'upcoming'
    },
    loading: false,
    error: null
};

// Reducer function
const contestReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case 'SET_CONTESTS':
            return {
                ...state,
                contests: action.payload,
                filteredContests: filterContests(
                    action.payload,
                    state.activeFilters
                ),
                loading: false,
                error: null
            };
        case 'SET_BOOKMARKED_CONTESTS':
            return {
                ...state,
                bookmarkedContests: action.payload,
                loading: false,
                error: null
            };
        case 'UPDATE_FILTERS':
            return {
                ...state,
                activeFilters: {
                    ...state.activeFilters,
                    ...action.payload
                },
                filteredContests: filterContests(
                    state.contests,
                    { ...state.activeFilters, ...action.payload }
                )
            };
        case 'TOGGLE_BOOKMARK':
            return {
                ...state,
                contests: state.contests.map(contest =>
                    contest._id === action.payload.contestId
                        ? { ...contest, isBookmarked: action.payload.isBookmarked }
                        : contest
                ),
                filteredContests: state.filteredContests.map(contest =>
                    contest._id === action.payload.contestId
                        ? { ...contest, isBookmarked: action.payload.isBookmarked }
                        : contest
                ),
                bookmarkedContests: action.payload.isBookmarked
                    ? [...state.bookmarkedContests, state.contests.find(c => c._id === action.payload.contestId)]
                    : state.bookmarkedContests.filter(c => c._id !== action.payload.contestId)
            };
        default:
            return state;
    }
};

// Helper function to filter contests
const filterContests = (contests, filters) => {
    return contests.filter(contest => {
        // Filter by platform
        if (!filters.platforms.includes(contest.platform)) {
            return false;
        }

        // Filter by status
        if (filters.status && contest.status !== filters.status) {
            return false;
        }

        return true;
    });
};

// Provider component
export const ContestProvider = ({ children }) => {
    const [state, dispatch] = useReducer(contestReducer, initialState);
    const { isAuthenticated } = useAuth();

    // Fetch all contests
    const fetchContests = async (filters = state.activeFilters) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Build query string
            const platformsParam = filters.platforms.join(',');
            const queryString = `?platforms=${platformsParam}&status=${filters.status}`;

            const res = await api.get(`/contests${queryString}`);

            dispatch({ type: 'SET_CONTESTS', payload: res.data.data });
            return res.data;
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err.response?.data?.message || 'Error fetching contests'
            });
            return Promise.reject(err);
        }
    };

    // Fetch bookmarked contests
    const fetchBookmarkedContests = async () => {
        if (!isAuthenticated) return;

        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const res = await api.get('/contests/bookmarks/me');

            dispatch({ type: 'SET_BOOKMARKED_CONTESTS', payload: res.data.data });
            return res.data;
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err.response?.data?.message || 'Error fetching bookmarked contests'
            });
            return Promise.reject(err);
        }
    };

    // Update filters
    const updateFilters = (newFilters) => {
        dispatch({ type: 'UPDATE_FILTERS', payload: newFilters });

        // Fetch contests with new filters
        fetchContests({ ...state.activeFilters, ...newFilters });
    };

    // Bookmark a contest
    const bookmarkContest = async (contestId) => {
        if (!isAuthenticated) return;

        try {
            await api.post('/contests/bookmark', { contestId });

            dispatch({
                type: 'TOGGLE_BOOKMARK',
                payload: { contestId, isBookmarked: true }
            });
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err.response?.data?.message || 'Error bookmarking contest'
            });
            return Promise.reject(err);
        }
    };

    // Remove bookmark
    const removeBookmark = async (contestId) => {
        if (!isAuthenticated) return;

        try {
            await api.delete(`/contests/bookmark/${contestId}`);

            dispatch({
                type: 'TOGGLE_BOOKMARK',
                payload: { contestId, isBookmarked: false }
            });
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err.response?.data?.message || 'Error removing bookmark'
            });
            return Promise.reject(err);
        }
    };

    // Update contest solution
    const updateContestSolution = async (contestId, solutionUrl) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            await api.post('/contests/solution', { contestId, solutionUrl });

            // Refresh contest data
            await fetchContests();

            return true;
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err.response?.data?.message || 'Error updating contest solution'
            });
            return Promise.reject(err);
        }
    };

    return (
        <ContestContext.Provider
            value={{
                contests: state.contests,
                filteredContests: state.filteredContests,
                bookmarkedContests: state.bookmarkedContests,
                activeFilters: state.activeFilters,
                loading: state.loading,
                error: state.error,
                fetchContests,
                fetchBookmarkedContests,
                updateFilters,
                bookmarkContest,
                removeBookmark,
                updateContestSolution
            }}
        >
            {children}
        </ContestContext.Provider>
    );
};

export const useContests = () => useContext(ContestContext);