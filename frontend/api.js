// API Module for backend communication

class API {
    constructor() {
        this.baseURL = AWS_CONFIG.apiEndpoint;
    }

    // Helper method to get auth headers
    getAuthHeaders() {
        const token = auth.getIdToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Handle API errors
    async handleResponse(response) {
        if (response.status === 401) {
            // Token expired, try to refresh
            try {
                await auth.refreshSession();
                // Retry the request would go here
                throw new Error('Session expired. Please try again.');
            } catch (error) {
                auth.signOut();
                window.location.reload();
                throw new Error('Session expired. Please login again.');
            }
        }

        const data = await response.json();

        // If backend is a Lambda proxy integration it may return an object
        // like { statusCode, headers, body } where body is a JSON string.
        // Normalize that here so callers get the real payload (array/object).
        let payload = data;
        if (data && typeof data === 'object' && data.body && typeof data.body === 'string') {
            try {
                payload = JSON.parse(data.body);
            } catch (e) {
                // body wasn't JSON — keep as-is
                payload = data.body;
            }
        }

        if (!response.ok) {
            const errMsg = (payload && payload.error) || (payload && payload.message) || 'Request failed';
            throw new Error(errMsg);
        }

        return payload;
    }

    // Get all tasks for the current user
    async getTasks() {
        try {
            const response = await fetch(`${this.baseURL}/tasks`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await this.handleResponse(response);

            // Normalize to an array so the UI can reliably call array methods
            if (Array.isArray(data)) return data;

            if (data && typeof data === 'object') {
                if (Array.isArray(data.Items)) return data.Items;
                if (Array.isArray(data.items)) return data.items;
                if (Array.isArray(data.tasks)) return data.tasks;
            }

            if (typeof data === 'string') {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {
                    // ignore parse error
                }
            }

            // Fallback to empty array
            return [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    // Create a new task
    async createTask(title) {
        try {
            const response = await fetch(`${this.baseURL}/tasks`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ title })
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    // Update a task (toggle completion status)
    async updateTask(taskId, completed) {
        try {
            const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ completed })
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    // Delete a task
    async deleteTask(taskId) {
        try {
            const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
}

// Create global API instance
window.api = new API();
