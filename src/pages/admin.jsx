import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '/lib/supabase.js';
import {
    FiUsers,
    FiCalendar,
    FiTrendingUp,
    FiDownload,
    FiLogOut,
    FiSearch,
    FiFilter,
    FiMail,
    FiPhone,
    FiBriefcase,
    FiClock,
    FiEye,
    FiTrash2,
    FiRefreshCw,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
    FiX
} from 'react-icons/fi';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [searchTerm, setSearchTerm] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    const SESSION_TIMEOUT = 30 * 60 * 1000;

    // Check screen size on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Stats calculations
    // const stats = {
    //     total: registrations.length,
    //     today: registrations.filter(r => {
    //         const today = new Date();
    //         const regDate = new Date(r.created_at);
    //         return regDate.toDateString() === today.toDateString();
    //     }).length,
    //     thisWeek: registrations.filter(r => {
    //         const oneWeekAgo = new Date();
    //         oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    //         return new Date(r.created_at) > oneWeekAgo;
    //     }).length,
    //     byType: {
    //         individual: registrations.filter(r => r.user_type === 'individual').length,
    //         professional: registrations.filter(r => r.user_type === 'professional').length,
    //         provider: registrations.filter(r => r.user_type === 'provider').length,
    //     }
    // };
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    const stats = {
        total: registrations.length,

        today: registrations.filter(r => {
            const d = new Date(r.created_at);
            return d >= startOfToday && d <= endOfToday;
        }).length,

        thisWeek: registrations.filter(r =>
            new Date(r.created_at) >= startOfWeek
        ).length,

        byType: {
            individual: registrations.filter(r => r.user_type === 'individual').length,
            professional: registrations.filter(r => r.user_type === 'professional').length,
            provider: registrations.filter(r => r.user_type === 'provider').length,
        }
    };



    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoginLoading(true);

        try {
            // First, let's see what's in the table
            const { data: allData, error: listError } = await supabase
                .from('admin_settings')
                .select('*');

            if (listError) {
                console.error('Error listing settings:', listError);
            }

            // Now try to get the specific password
            const { data, error: fetchError } = await supabase
                .from('admin_settings')
                .select('setting_value')
                .eq('setting_key', 'admin_password')
                .single();

            if (fetchError) {
                console.error('Error fetching admin password:', fetchError);
                throw new Error('Failed to verify password. Please check database configuration.');
            }

            // Get the correct password from database
            const correctPassword = data?.setting_value;

            if (!correctPassword) {
                throw new Error('Admin password not configured in database');
            }

            // Compare passwords
            if (password === correctPassword) {
                setIsAuthenticated(true);
                setLastActivity(Date.now());
                localStorage.setItem('admin-authenticated', Date.now().toString());
            } else {
                setError('Incorrect password');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    // const fetchRegistrations = async () => {
    //     setLoading(true);
    //     setError('');

    //     try {
    //         const { data, error } = await supabase
    //             .from('waiting_list')
    //             .select('*')
    //             .order('created_at', { ascending: false });

    //         if (error) throw error;



    //         setRegistrations(data || []);
    //         setFilteredRegistrations(data || []);
    //     } catch (err) {
    //         console.error('Error fetching data:', err);
    //         setError('Failed to load registrations: ' + err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchRegistrations = async () => {
        setLoading(true);
        setError('');

        try {
            // First get the total count
            const { count: totalCount, error: countError } = await supabase
                .from('waiting_list')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;

            console.log('Total registrations in database:', totalCount);

            // Fetch all data with a single query using a large limit
            const { data, error } = await supabase
                .from('waiting_list')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(totalCount || 5000); // Set limit to the total count

            if (error) throw error;

            console.log('Fetched registrations:', data?.length || 0);

            setRegistrations(data || []);
            setFilteredRegistrations(data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load registrations: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Session management
    useEffect(() => {
        const authTimestamp = localStorage.getItem('admin-authenticated');
        if (authTimestamp) {
            const timeSinceLogin = Date.now() - parseInt(authTimestamp);
            if (timeSinceLogin < SESSION_TIMEOUT) {
                setIsAuthenticated(true);
                setLastActivity(Date.now());
            } else {
                localStorage.removeItem('admin-authenticated');
            }
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchRegistrations();
        }
    }, [isAuthenticated]);

    // Auto-logout on inactivity
    useEffect(() => {
        if (!isAuthenticated) return;

        const activities = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        const updateActivity = () => {
            setLastActivity(Date.now());
        };

        activities.forEach(event => {
            window.addEventListener(event, updateActivity);
        });

        const activityCheck = setInterval(() => {
            const now = Date.now();
            const timeSinceLastActivity = now - lastActivity;

            if (timeSinceLastActivity > SESSION_TIMEOUT) {
                handleLogout();
                alert('Session expired due to inactivity. Please login again.');
            }
        }, 30000);

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                setLastActivity(Date.now());
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            activities.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });
            clearInterval(activityCheck);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated, lastActivity]);

    // Auto-logout when navigating to non-admin pages
    useEffect(() => {
        if (!isAuthenticated) return;

        const handleRouteChange = (url) => {
            if (!url.startsWith('/admin')) {
                handleLogout();
            }
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [isAuthenticated, router]);

    // Handle browser back/forward buttons
    useEffect(() => {
        if (!isAuthenticated) return;

        const handlePopState = () => {
            if (!window.location.pathname.startsWith('/admin')) {
                handleLogout();
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isAuthenticated]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin-authenticated');
        router.push('/');
    };

    const handleRefresh = () => {
        fetchRegistrations();
    };

    // Apply filters
    useEffect(() => {
        let filtered = [...registrations];

        if (searchTerm) {
            filtered = filtered.filter(reg =>
                reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (reg.phone && reg.phone.includes(searchTerm)) ||
                (reg.company && reg.company.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (userTypeFilter !== 'all') {
            filtered = filtered.filter(reg => reg.user_type === userTypeFilter);
        }

        if (dateFilter !== 'all') {
            const now = new Date();
            let startDate = new Date();

            switch (dateFilter) {
                case 'today':
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
            }

            filtered = filtered.filter(reg => new Date(reg.created_at) >= startDate);
        }

        setFilteredRegistrations(filtered);
        setCurrentPage(1);
    }, [searchTerm, userTypeFilter, dateFilter, registrations]);

    // Pagination
    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredRegistrations.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        if (isMobile) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return formatDate(dateString);
        }
    };

    const getUserTypeColor = (type) => {
        switch (type) {
            case 'individual': return 'bg-blue-100 text-blue-800';
            case 'professional': return 'bg-green-100 text-green-800';
            case 'provider': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUserTypeLabel = (type) => {
        const serviceTypeLabels = {
            'landlord': 'Landlord',
            'tenant': 'Tenant',
            'buyer': 'Buyer',
            'seller': 'Seller',
            'estate_agent': 'Estate Agent',
            'corporate_relocation': 'Corporate Relocation',
            'surveyor': 'Surveyor',
            'architect': 'Architect',
            'structural_engineer': 'Structural Engineer',
            'interior_designer': 'Interior Designer',
            'builder': 'Builder',
            'bricklayer': 'Bricklayer',
            'plumber_electrician': 'Plumber/Electrician',
            'carpenter_joiner': 'Carpenter/Joiner',
            'tiler': 'Tiler',
            'landscaper': 'Landscaper',
            'lawyer': 'Lawyer',
            'bank_financial': 'Bank/Financial',
            'accountant_bookkeeping': 'Accountant',
            'insurance': 'Insurance',
            'smart_systems_cctv': 'Smart Systems/CCTV',
            'security_company': 'Security Company',
            'real_estate_agent': 'Real Estate Agent',
            'property_management': 'Property Management',
            'legal_services': 'Legal Services',
            'construction': 'Construction',
            'electrical': 'Electrical Services',
            'plumbing': 'Plumbing Services',
            'building_materials': 'Building Materials',
            'other': 'Other',
        };

        if (type === 'individual') return 'Buyer/Tenant';
        if (type === 'professional') return 'Professional';
        if (type === 'provider') return 'Service Provider';
        return serviceTypeLabels[type] || type;
    };

    const viewRegistrationDetails = (reg) => {
        setSelectedRegistration(reg);
        setShowModal(true);
    };

    const exportToCSV = () => {
        const headers = ['Email', 'Phone', 'User Type', 'Service Type', 'Company', 'Message', 'Date Joined'];

        const csvData = registrations.map(reg => [
            reg.email,
            reg.phone || '',
            getUserTypeLabel(reg.user_type),
            getUserTypeLabel(reg.service_type),
            reg.company || '',
            `"${(reg.message || '').replace(/"/g, '""')}"`,
            formatDate(reg.created_at)
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zammspace-waiting-list-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // Login form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Head>
                    <title>Admin Login - ZamSpace</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                </Head>

                <div className="max-w-md w-full space-y-8 p-4 sm:p-6 lg:p-8">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-green-600 rounded-sm flex items-center justify-center">
                            <FiUsers className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900">
                            Admin Dashboard
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-gray-600">
                            ZamSpace Waiting List Management
                        </p>
                    </div>

                    <div className="rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                        <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-sm">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 pt-0.5">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-xs sm:text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm sm:text-base"
                                        placeholder="Enter admin password"
                                        required
                                        disabled={loginLoading}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loginLoading}
                                className="w-full py-2 sm:py-3 px-4 bg-green-600 text-white font-medium rounded-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                            >
                                {loginLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <>
            <Head>
                <title>Admin Dashboard - ZamSpace</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            </Head>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowMobileMenu(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Menu</h3>
                                <button
                                    onClick={() => setShowMobileMenu(false)}
                                    className="p-2 hover:bg-gray-100 rounded-sm"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center text-sm text-gray-500 p-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span>Session Active</span>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-sm transition"
                            >
                                <FiRefreshCw className="mr-3 h-5 w-5" />
                                Refresh Data
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="w-full flex items-center p-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition"
                            >
                                <FiDownload className="mr-3 h-5 w-5" />
                                Export CSV
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center p-3 border border-red-300 text-red-700 rounded-sm hover:bg-red-50 transition"
                            >
                                <FiLogOut className="mr-3 h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Registration Details */}
            {showModal && selectedRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden mx-2 sm:mx-0">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Registration Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-500 p-1"
                                >
                                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-sm flex items-center justify-center">
                                            <FiMail className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Email</h4>
                                        <p className="mt-1 text-sm sm:text-lg text-gray-900 break-all">{selectedRegistration.email}</p>
                                    </div>
                                </div>

                                {selectedRegistration.phone && (
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-sm flex items-center justify-center">
                                                <FiPhone className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-xs sm:text-sm font-medium text-gray-500">Phone</h4>
                                            <p className="mt-1 text-sm sm:text-lg text-gray-900">{selectedRegistration.phone}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-sm flex items-center justify-center">
                                            <FiBriefcase className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">User Type</h4>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-sm text-xs sm:text-sm font-medium ${getUserTypeColor(selectedRegistration.user_type)}`}>
                                                {getUserTypeLabel(selectedRegistration.user_type)}
                                            </span>
                                        </div>
                                        {selectedRegistration.service_type && (
                                            <p className="mt-2 text-xs sm:text-sm text-gray-600 break-words">
                                                Service: {selectedRegistration.service_type}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {selectedRegistration.company && (
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-sm flex items-center justify-center">
                                                <FiBriefcase className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-xs sm:text-sm font-medium text-gray-500">Company/Organization</h4>
                                            <p className="mt-1 text-sm sm:text-lg text-gray-900 break-words">{selectedRegistration.company}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedRegistration.message && (
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Message</h4>
                                        <div className="bg-gray-50 rounded-sm p-3 sm:p-4">
                                            <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">{selectedRegistration.message}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-100 rounded-sm flex items-center justify-center">
                                            <FiClock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-500">Registration Date</h4>
                                        <p className="mt-1 text-sm sm:text-lg text-gray-900">{formatDate(selectedRegistration.created_at)}</p>
                                        <p className="mt-1 text-xs sm:text-sm text-gray-500">{formatRelativeTime(selectedRegistration.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition text-sm sm:text-base"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen mt-18">
                {/* Header */}
                <header className="shadow-sm border-b border-gray-200 sticky top-0 bg-white z-30">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                        <div className="flex justify-between items-center py-3 sm:py-4">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowMobileMenu(true)}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-sm"
                                >
                                    <FiMenu className="h-5 w-5 text-gray-600" />
                                </button>
                                <div className="bg-green-600 p-2 rounded-sm hidden sm:block">
                                    <FiUsers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">ZamSpace Waiting Lists</h1>
                                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Manage your waiting list registrations</p>
                                </div>
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                                <div className="hidden lg:flex items-center text-sm text-gray-500">
                                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    <span>Session Active</span>
                                </div>

                                <button
                                    onClick={handleRefresh}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition"
                                    title="Refresh data"
                                >
                                    <FiRefreshCw className="h-5 w-5" />
                                </button>

                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center px-3 py-2 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition text-sm"
                                >
                                    <FiDownload className="mr-1 lg:mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                                    <span className="hidden lg:inline">Export CSV</span>
                                    <span className="lg:hidden">Export</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-3 py-2 lg:px-4 lg:py-2 border border-red-300 text-red-700 rounded-sm hover:bg-red-50 transition text-sm"
                                >
                                    <FiLogOut className="mr-1 lg:mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                                    <span className="hidden lg:inline">Logout</span>
                                </button>
                            </div>

                            {/* Mobile Actions - Icons only */}
                            <div className="flex md:hidden items-center space-x-2">
                                <button
                                    onClick={handleRefresh}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition"
                                    title="Refresh data"
                                >
                                    <FiRefreshCw className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={exportToCSV}
                                    className="p-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition"
                                    title="Export CSV"
                                >
                                    <FiDownload className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1250px] mx-auto px-2 sm:px-3 lg:px-6 py-4 sm:py-6 lg:py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
                        <div className="rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Registrations</p>
                                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">Today</p>
                                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-green-600">{stats.today}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600">This Week</p>
                                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-blue-600">{stats.thisWeek}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col space-y-4">
                            <div className="w-full">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                                    <input
                                        type="text"
                                        placeholder="Search by email, phone, or company..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <div className="relative">
                                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                                    <select
                                        value={userTypeFilter}
                                        onChange={(e) => setUserTypeFilter(e.target.value)}
                                        className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none text-sm sm:text-base bg-white"
                                    >
                                        <option value="all">All Categories</option>
                                        <optgroup label="Main Categories">
                                            <option value="individual">Buyers/Tenants</option>
                                            <option value="professional">Property Professionals</option>
                                            <option value="provider">Service Providers</option>
                                        </optgroup>
                                        <optgroup label="Property Professionals">
                                            <option value="landlord">Landlords</option>
                                            <option value="estate_agent">Estate Agents</option>
                                            <option value="seller">Sellers</option>
                                        </optgroup>
                                        <optgroup label="Service Providers">
                                            <option value="architect">Architects</option>
                                            <option value="builder">Builders</option>
                                            <option value="lawyer">Lawyers</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none text-sm sm:text-base bg-white"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>

                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none text-sm sm:text-base bg-white"
                                >
                                    <option value="10">10 per page</option>
                                    <option value="25">25 per page</option>
                                    <option value="50">50 per page</option>
                                    <option value="100">100 per page</option>
                                </select>

                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 lg:hidden">
                                    <div>
                                        {filteredRegistrations.length} results
                                    </div>
                                    <div className="text-gray-500">
                                        Page {currentPage}/{totalPages}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center justify-between text-sm text-gray-600">
                                <div>
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredRegistrations.length)} of{' '}
                                    {filteredRegistrations.length} registrations
                                    {searchTerm && ` (filtered from ${registrations.length})`}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Results:</span>
                                    <span className="font-medium">{filteredRegistrations.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registrations Table */}
                    <div className="rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">All Registrations</h2>
                                <div className="text-xs sm:text-sm text-gray-600">
                                    {loading ? 'Updating...' : `${filteredRegistrations.length} registrations`}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-8 sm:p-12 text-center">
                                <div className="inline-flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
                                </div>
                                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading registrations...</p>
                            </div>
                        ) : error ? (
                            <div className="p-4 sm:p-6">
                                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-sm">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 pt-0.5">
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-xs sm:text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : filteredRegistrations.length === 0 ? (
                            <div className="p-8 sm:p-12 text-center">
                                <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 rounded-sm flex items-center justify-center">
                                    <FiSearch className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                                </div>
                                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">No registrations found</h3>
                                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                                    {searchTerm ? 'Try adjusting your search or filters' : 'No registrations yet'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th scope="col" className="hidden sm:table-cell px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contact
                                                </th>
                                                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {currentItems.map((reg) => (
                                                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-green-100 rounded-sm flex items-center justify-center">
                                                                <FiMail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                                            </div>
                                                            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                                                                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{reg.email}</div>
                                                                {reg.company && (
                                                                    <div className="text-xs text-gray-500 truncate hidden sm:block">{reg.company}</div>
                                                                )}
                                                                <div className="text-xs text-gray-500 sm:hidden">
                                                                    {reg.phone || 'No phone'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                        <div className="flex flex-col space-y-1">
                                                            <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-sm text-xs font-medium ${getUserTypeColor(reg.user_type)}`}>
                                                                {getUserTypeLabel(reg.user_type)}
                                                            </span>
                                                            {reg.service_type && (
                                                                <span className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-[120px]">
                                                                    {reg.service_type}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="hidden sm:table-cell px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {reg.phone || 'No phone'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {reg.message ? `${reg.message.substring(0, 30)}...` : 'No message'}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                        <div className="text-xs sm:text-sm text-gray-900">
                                                            {isMobile ? formatRelativeTime(reg.created_at) : formatDate(reg.created_at)}
                                                        </div>
                                                        {!isMobile && (
                                                            <div className="text-xs text-gray-500">
                                                                {formatRelativeTime(reg.created_at)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                                            <button
                                                                onClick={() => viewRegistrationDetails(reg)}
                                                                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded-sm transition"
                                                                title="View details"
                                                            >
                                                                <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Previous
                                                </button>
                                                <div className="flex items-center px-3 py-2">
                                                    <span className="text-xs text-gray-700">{currentPage}/{totalPages}</span>
                                                </div>
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Page <span className="font-medium">{currentPage}</span> of{' '}
                                                        <span className="font-medium">{totalPages}</span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-sm shadow-sm -space-x-px">
                                                        <button
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            className="relative inline-flex items-center px-2 py-2 rounded-l-sm border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <span className="sr-only">Previous</span>
                                                            <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        </button>

                                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                            let pageNumber;
                                                            if (totalPages <= 5) {
                                                                pageNumber = i + 1;
                                                            } else if (currentPage <= 3) {
                                                                pageNumber = i + 1;
                                                            } else if (currentPage >= totalPages - 2) {
                                                                pageNumber = totalPages - 4 + i;
                                                            } else {
                                                                pageNumber = currentPage - 2 + i;
                                                            }

                                                            return (
                                                                <button
                                                                    key={pageNumber}
                                                                    onClick={() => handlePageChange(pageNumber)}
                                                                    className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium ${currentPage === pageNumber
                                                                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                                                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    {pageNumber}
                                                                </button>
                                                            );
                                                        })}

                                                        <button
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            className="relative inline-flex items-center px-2 py-2 rounded-r-sm border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <span className="sr-only">Next</span>
                                                            <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        </button>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}