const API_URL = import.meta.env.VITE_API_BASE_URL + '/auth';

export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(errorData.detail);
  }

  return response.json();
};

export const register = async (username: string, email: string, password: string, termsAccepted: boolean = false, privacyAccepted: boolean = false) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            username, 
            email, 
            password,
            terms_accepted: termsAccepted,
            privacy_accepted: privacyAccepted
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
        throw new Error(errorData.detail);
    }

    return response.json();
};


export const verifyAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const response = await fetch(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
            }
            return false;
        }

        return true;
    } catch {
        return false;
    }
};

export const getMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        throw new Error('Session expired');
    }

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return response.json();
};

const LEGAL_API_URL = import.meta.env.VITE_API_BASE_URL + '/legal';

export const getTermsStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${LEGAL_API_URL}/terms-status`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch terms status');
    }

    return response.json();
};

export const acceptTerms = async (acceptTerms: boolean, acceptPrivacy: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${LEGAL_API_URL}/accept-terms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            accept_terms: acceptTerms,
            accept_privacy: acceptPrivacy
        })
    });

    if (!response.ok) {
        throw new Error('Failed to accept terms');
    }

    return response.json();
};

export const getTermsContent = async () => {
    const response = await fetch(`${LEGAL_API_URL}/terms-content`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch terms content');
    }

    return response.json();
};
