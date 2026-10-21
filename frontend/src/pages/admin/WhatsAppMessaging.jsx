import { useState } from 'react';
import { Send, MessageCircle, Image, Users, TestTube, FileText, Activity } from 'lucide-react';
import api from '../../utils/api';

export default function WhatsAppMessaging() {
  const [activeTab, setActiveTab] = useState('single');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [quota, setQuota] = useState(null);

  // Single message state
  const [singlePhone, setSinglePhone] = useState('');
  const [singleCustomText, setSingleCustomText] = useState('');
  const [useCustomText, setUseCustomText] = useState(false);

  // Bulk message state
  const [bulkPhones, setBulkPhones] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');

  // Image message state
  const [imagePhone, setImagePhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  // Document message state
  const [docPhone, setDocPhone] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docFileName, setDocFileName] = useState('');
  const [docCaption, setDocCaption] = useState('');

  const updateQuotaFromResponse = (resData) => {
    if (resData?.quota) {
      setQuota(resData.quota);
    }
  };

  const handleSendSingle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let response;
      if (useCustomText && singleCustomText.trim()) {
        response = await api.post('/api/whatsapp/order-confirmation', {
          orderId: 'MANUAL-' + Date.now().toString().slice(-4),
          customerPhone: singlePhone,
          customerName: 'Customer',
          total: '0',
          deliveryDate: new Date().toLocaleDateString('en-IN')
        });
      } else {
        response = await api.post('/api/whatsapp/order-confirmation', {
          orderId: 'TEST-' + Date.now().toString().slice(-4),
          customerPhone: singlePhone,
          customerName: 'Customer',
          total: '999',
          deliveryDate: new Date().toLocaleDateString('en-IN')
        });
      }

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: `Message dispatched successfully! ✅ Message ID: ${response.messageId || 'Queued'}`
      });
      setSinglePhone('');
      setSingleCustomText('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || error.message || 'Failed to send message'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const phoneArray = bulkPhones
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (phoneArray.length === 0) {
        setResult({
          type: 'error',
          message: 'Please enter at least one phone number'
        });
        setLoading(false);
        return;
      }

      const response = await api.post('/api/whatsapp/campaign', {
        phoneNumbers: phoneArray,
        message: bulkMessage
      });

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: `Campaign complete! ✅ Sent: ${response.sent}, Failed: ${response.failed}`
      });
      setBulkPhones('');
      setBulkMessage('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send campaign'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/api/whatsapp/send-image', {
        customerPhone: imagePhone,
        imageUrl: imageUrl,
        caption: imageCaption
      });

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: 'Image dispatched successfully via SwiftProject Gateway! ✅'
      });
      setImagePhone('');
      setImageUrl('');
      setImageCaption('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send image'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendDocument = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/api/whatsapp/send-document', {
        customerPhone: docPhone,
        documentUrl: docUrl,
        fileName: docFileName || 'document.pdf',
        caption: docCaption
      });

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: 'Document dispatched successfully! ✅'
      });
      setDocPhone('');
      setDocUrl('');
      setDocFileName('');
      setDocCaption('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send document'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await api.get('/api/whatsapp/test');
      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: `Gateway test successful! 🚀 Sent to: ${response.to || 'Admin'} (Message ID: ${response.messageId || 'OK'})`
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || error.response?.data?.details?.error || error.message || 'Test connection failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">WhatsApp Messaging</h1>
          <p className="text-gray-600 mt-1">
            SwiftProject WhatsApp Gateway integration for Geethika Digital World
          </p>
        </div>

        {/* Test Connection Button */}
        <button
          onClick={handleTest}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <TestTube className="w-4 h-4" />
          {loading ? 'Testing...' : 'Test Gateway Connection'}
        </button>
      </div>

      {/* Quota Widget (if available) */}
      {quota && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <span className="font-semibold text-lg">Gateway Quota Status ({quota.plan || 'Active'})</span>
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              Resets at {quota.resetsAt ? new Date(quota.resetsAt).toLocaleTimeString() : 'Midnight UTC'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/80 uppercase">Daily Limit</p>
              <p className="text-2xl font-bold mt-1">{quota.dailyLimit ?? '—'}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/80 uppercase">Used Today</p>
              <p className="text-2xl font-bold mt-1">{quota.usedToday ?? '—'}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/80 uppercase">Remaining</p>
              <p className="text-2xl font-bold mt-1 text-emerald-100">{quota.dailyRemaining ?? '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result Alert */}
      {result && (
        <div className={`p-4 rounded-xl border ${
          result.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="font-medium">{result.message}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('single')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'single'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Order / Single Message
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'bulk'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Bulk Campaign
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'image'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image className="w-4 h-4" />
            Send Image
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'document'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Send Document
          </button>
        </div>
      </div>

      {/* Single Message Tab */}
      {activeTab === 'single' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Send WhatsApp Notification</h2>
          <form onSubmit={handleSendSingle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={singlePhone}
                onChange={(e) => setSinglePhone(e.target.value)}
                placeholder="e.g. 919492686421 or 9492686421"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: Digits only or with country code. Auto-formatted for SwiftProject Gateway.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Dispatching...' : 'Send Order Confirmation Message'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Campaign Tab */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Send Bulk WhatsApp Campaign</h2>
          <form onSubmit={handleSendBulk} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Numbers (one per line)
              </label>
              <textarea
                value={bulkPhones}
                onChange={(e) => setBulkPhones(e.target.value)}
                placeholder="919492686421&#10;919876543210&#10;918765432109"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Content
              </label>
              <textarea
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
                placeholder="✨ Special Offer! Get 20% off on all personalized photo frames at Geethika Digital World this week. Order online: https://geethikadigitalworld.com/shop"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
            >
              <Users className="w-4 h-4" />
              {loading ? 'Processing Campaign...' : 'Send Campaign'}
            </button>
          </form>
        </div>
      )}

      {/* Send Image Tab */}
      {activeTab === 'image' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Send Product Image</h2>
          <form onSubmit={handleSendImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={imagePhone}
                onChange={(e) => setImagePhone(e.target.value)}
                placeholder="919492686421"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/.../image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption (optional)
              </label>
              <textarea
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Check out this personalized mug sample! 🎁"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
            >
              <Image className="w-4 h-4" />
              {loading ? 'Sending Image...' : 'Send Image'}
            </button>
          </form>
        </div>
      )}

      {/* Send Document Tab */}
      {activeTab === 'document' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Send Invoice / Document PDF</h2>
          <form onSubmit={handleSendDocument} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={docPhone}
                onChange={(e) => setDocPhone(e.target.value)}
                placeholder="919492686421"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document URL (PDF / DOC)
              </label>
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://example.com/invoice-1001.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name
              </label>
              <input
                type="text"
                value={docFileName}
                onChange={(e) => setDocFileName(e.target.value)}
                placeholder="Invoice-1001.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption (optional)
              </label>
              <input
                type="text"
                value={docCaption}
                onChange={(e) => setDocCaption(e.target.value)}
                placeholder="Here is your tax invoice from Geethika Digital World"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {loading ? 'Sending Document...' : 'Send Document'}
            </button>
          </form>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <h3 className="font-semibold text-emerald-900 mb-2">⚡ SwiftProject WhatsApp Gateway Active</h3>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• Connected to SwiftProject Gateway endpoint: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-xs">https://wg.swiftproject.in/api/send</code></li>
          <li>• Session identified directly via API token. No Meta Business verification delays.</li>
          <li>• Standard international format without '+' (e.g. 919876543210). Auto-sanitized on dispatch.</li>
          <li>• Built-in rate limiting protection and automatic quota tracking.</li>
        </ul>
      </div>
    </div>
  );
}
