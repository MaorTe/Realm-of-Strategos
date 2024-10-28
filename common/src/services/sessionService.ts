export const createSession = () => {
    // Shared logic to create a session
    return { sessionId: 'abc123', status: 'active' };
  };
  
export const getSessionById = (sessionId: string) => {
    // Shared logic to retrieve a session by ID
    return { sessionId, status: 'active' };
  };