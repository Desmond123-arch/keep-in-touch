import request from 'supertest';
import app from '../app'; 

describe('Send Message', () => {
    it('should return 500 on message failure', async () => {
        const response = await request(app)
            .post('/chat')
            .send({
                sender: 'invalid-id',
                receiver: 'invalid-id',
                messageDetails: { text: 'Hello!' }
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to send message');
    });
});

describe('Get Conversation', () => {
    it('should return a conversation between two users', async () => {
        const response = await request(app)
            .get('/chat/conversation/607f1f77bcf86cd799439011/607f1f77bcf86cd799439012'); // Corrected route

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('participants');
    });

    it('should return 500 for invalid user IDs', async () => {
        const response = await request(app)
            .get('/chat/conversation/invalid-id/invalid-id');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to get conversation');
    });
});
