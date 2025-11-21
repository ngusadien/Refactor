import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchConversations, fetchConversationById, sendMessage } from '../../features/messages/messageSlice';
import { format } from 'date-fns';

const MessagesPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { conversations, currentConversation, messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    dispatch(fetchConversationById(conversationId));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversationId) {
      dispatch(sendMessage({
        conversationId: selectedConversationId,
        content: messageText,
      }));
      setMessageText('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('messages.conversations')}</h1>

      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">{t('messages.conversations')}</h2>
            </div>
            {loading && conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-600">{t('common.loading')}</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-600">{t('messages.noMessages')}</div>
            ) : (
              <div>
                {conversations.map((conv) => (
                  <button
                    key={conv.id || conv._id}
                    onClick={() => handleSelectConversation(conv.id || conv._id)}
                    className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 text-left transition-colors ${
                      selectedConversationId === (conv.id || conv._id) ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                        {conv.participant?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conv.participant?.name || 'User'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversationId ? (
              <>
                {/* Messages Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {currentConversation?.participant?.name || 'Conversation'}
                  </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id || msg._id}
                      className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId === user?.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-primary-100' : 'text-gray-500'}`}>
                          {msg.createdAt && format(new Date(msg.createdAt), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={t('messages.typeMessage')}
                      className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary">
                      {t('messages.send')}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
