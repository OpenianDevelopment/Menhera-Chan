import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
  createMockClient,
  createMockMessage,
  createMockUser
} from '../helpers.js';

// Import the command after environment setup
import banCommand from '../../commands/moderation/ban.js';

// Setup test environment
setupTestEnvironment();

describe('Ban Command', () => {
  let mockClient;
  let mockMessage;

  beforeEach(() => {
    mockClient = createMockClient();
    mockMessage = createMockMessage({
      content: '!ban @user spam',
      mentions: true
    });
  });

  afterEach(() => {
    teardownTestEnvironment();
  });

  test('should have correct command properties', () => {
    expect(banCommand.name).toBe('ban');
    expect(banCommand.description).toBeDefined();
    expect(banCommand.category).toBe('moderation');
    expect(banCommand.args).toBe(true);
    expect(banCommand.dmAllowed).toBe(false);
    expect(typeof banCommand.execute).toBe('function');
  });

  test('should parse user mentions correctly', async () => {
    // eslint-disable-next-line no-unused-vars
    const target = await banCommand.parseTarget(mockMessage, '@user456');
    expect(target).toBeDefined();
    expect(target.id).toBe('user456');
  });

  test('should parse user IDs correctly', async () => {
    const target = await banCommand.parseTarget(mockMessage, '123456789012345678');
    expect(mockClient.users.fetch).toHaveBeenCalledWith('123456789012345678');
  });

  test('should return null for invalid input', async () => {
    const target = await banCommand.parseTarget(mockMessage, 'invalid');
    expect(target).toBeNull();
  });

  test('should validate ban operation correctly', async () => {
    const mockUser = createMockUser({ bot: false });
    const validation = await banCommand.validateBan(mockMessage, mockUser);
    expect(validation.valid).toBe(true);
  });

  test('should reject banning bots', async () => {
    const mockBot = createMockUser({ bot: true });
    const validation = await banCommand.validateBan(mockMessage, mockBot);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('Cannot ban bots');
  });

  test('should reject self-ban', async () => {
    const selfUser = createMockUser({ id: 'user123' });
    const validation = await banCommand.validateBan(mockMessage, selfUser);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('cannot ban yourself');
  });

  test('should create ban embed with correct properties', () => {
    const mockUser = createMockUser();
    const mockModerator = createMockUser({ username: 'Moderator' });
    const mockGuild = { name: 'Test Guild', iconURL: () => 'icon.png' };

    const embed = banCommand.createBanEmbed(mockUser, mockModerator, 'Test reason', mockGuild);

    expect(embed.data.title).toBe('🔨 You have been banned');
    expect(embed.data.color).toBe(0xff0000);
    expect(embed.data.description).toContain('Test Guild');
  });

  test('should create confirmation embed with correct properties', () => {
    const mockUser = createMockUser();
    const mockModerator = createMockUser({ username: 'Moderator' });

    const embed = banCommand.createConfirmationEmbed(mockUser, mockModerator, 'Test reason');

    expect(embed.data.title).toBe('🔨 Member Banned');
    expect(embed.data.color).toBe(0xff0000);
    expect(embed.data.description).toContain('has been banned');
  });

  test('should execute ban command successfully', async () => {
    // Mock the functions
    jest.spyOn(banCommand, 'parseTarget').mockResolvedValue(createMockUser({ id: 'user456' }));
    jest.spyOn(banCommand, 'validateBan').mockResolvedValue({ valid: true });
    jest.spyOn(banCommand, 'sendDMNotification').mockResolvedValue();
    jest.spyOn(banCommand, 'logModerationAction').mockResolvedValue();
    jest.spyOn(banCommand, 'updateUserProfile').mockResolvedValue();

    const args = ['user456', 'spam'];

    await banCommand.execute(mockMessage, args, mockClient);

    expect(mockMessage.guild.members.ban).toHaveBeenCalledWith('user456', expect.any(Object));
    expect(mockMessage.reply).toHaveBeenCalled();
  });

  test('should handle errors gracefully', async () => {
    jest.spyOn(banCommand, 'parseTarget').mockRejectedValue(new Error('Test error'));

    const args = ['invalid'];

    await banCommand.execute(mockMessage, args, mockClient);

    expect(mockMessage.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('error occurred')
      })
    );
  });
});
