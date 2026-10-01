/**
 * AI RTL Fixer - Platform Adapters
 * Provides tailored selectors for ChatGPT, Claude, DeepSeek, Gemini, and Perplexity.
 */

const PLATFORM_ADAPTERS = [
  {
    name: 'ChatGPT',
    matches: (hostname) => hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com'),
    messageSelectors: [
      '[data-message-author-role] .markdown',
      '[data-message-author-role] .prose',
      '[data-message-author-role] p',
      '[data-message-author-role] li',
      '[data-message-author-role] h1, [data-message-author-role] h2, [data-message-author-role] h3',
      'article .markdown p',
      'article .markdown li'
    ],
    inputSelectors: [
      '#prompt-textarea',
      '[contenteditable="true"]',
      'textarea[data-id]'
    ],
    ignoreSelectors: 'pre, code, .code-block, table, .math, .katex'
  },
  {
    name: 'Claude',
    matches: (hostname) => hostname.includes('claude.ai'),
    messageSelectors: [
      '.font-user-message',
      '.font-claude-message',
      '.font-claude-message p',
      '.font-claude-message li',
      '.font-claude-message h1, .font-claude-message h2, .font-claude-message h3',
      '[data-testid="user-message"]',
      '.grid p, .grid li'
    ],
    inputSelectors: [
      'div.ProseMirror[contenteditable="true"]',
      '[contenteditable="true"]',
      'textarea'
    ],
    ignoreSelectors: 'pre, code, .code-block, table, .math, .katex'
  },
  {
    name: 'DeepSeek',
    matches: (hostname) => hostname.includes('deepseek.com'),
    messageSelectors: [
      '.markdown-body',
      '.markdown-body p',
      '.markdown-body li',
      '.markdown-body h1, .markdown-body h2, .markdown-body h3',
      '.fbb737a4',
      '.ds-markdown p',
      '.ds-markdown li',
      'div[class*="markdown"] p',
      'div[class*="markdown"] li'
    ],
    inputSelectors: [
      'textarea[placeholder]',
      'textarea',
      '[contenteditable="true"]'
    ],
    ignoreSelectors: 'pre, code, .code-block, table, .math, .katex'
  },
  {
    name: 'Google Gemini',
    matches: (hostname) => hostname.includes('gemini.google.com'),
    messageSelectors: [
      '.model-response-text',
      '.user-query',
      'message-content',
      'message-content p',
      'message-content li',
      '.text-content p',
      '.text-content li'
    ],
    inputSelectors: [
      'rich-textarea [contenteditable="true"]',
      'rich-textarea p',
      '[contenteditable="true"]',
      'textarea'
    ],
    ignoreSelectors: 'pre, code, .code-block, code-block, table, .math, .katex'
  },
  {
    name: 'Perplexity AI',
    matches: (hostname) => hostname.includes('perplexity.ai'),
    messageSelectors: [
      '.prose',
      '.prose p',
      '.prose li',
      '.prose h1, .prose h2, .prose h3',
      '.break-words',
      '.break-words p',
      '.break-words li'
    ],
    inputSelectors: [
      'div[contenteditable="true"]',
      'textarea',
      'input[type="text"]'
    ],
    ignoreSelectors: 'pre, code, .code-block, table, .math, .katex, .citation'
  },
  {
    name: 'Poe',
    matches: (hostname) => hostname.includes('poe.com'),
    messageSelectors: [
      '[class*="Message_markdownContainer"] p',
      '[class*="Message_markdownContainer"] li',
      '[class*="ChatMessage_messageBubble"] p'
    ],
    inputSelectors: [
      'textarea[class*="ChatMessageInput"]',
      '[contenteditable="true"]',
      'textarea'
    ],
    ignoreSelectors: 'pre, code, table'
  }
];

function getCurrentAdapter() {
  const host = window.location.hostname;
  return PLATFORM_ADAPTERS.find(adapter => adapter.matches(host)) || {
    name: 'Generic AI',
    matches: () => true,
    messageSelectors: [
      '.markdown p',
      '.markdown li',
      '.prose p',
      '.prose li',
      'article p',
      'article li'
    ],
    inputSelectors: [
      '[contenteditable="true"]',
      'textarea',
      'input[type="text"]'
    ],
    ignoreSelectors: 'pre, code, table'
  };
}

// Export for engine.js
window.__AI_RTL_ADAPTER__ = getCurrentAdapter();
