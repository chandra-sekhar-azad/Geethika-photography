import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  MessageCircle,
  Image,
  Users,
  TestTube,
  FileText,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import api from '../../utils/api';

export default function WhatsAppMessaging() {
  const [activeTab, setActiveTab] = useState('single');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [quota, setQuota] = useState(null);

  // Templates
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateVariables, setTemplateVariables] = useState({});

  // Single / Custom message state
  const [singlePhone, setSinglePhone] = useState('');
  const [singleCustomerName, setSingleCustomerName] = useState('');
  const [singleCustomText, setSingleCustomText] = useState('');

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

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await api.get('/api/whatsapp/templates');
      setTemplates(res.templates || []);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const updateQuotaFromResponse = (resData) => {
    if (resData?.quota) {
      setQuota(resData.quota);
    }
  };

  // When a template is selected from the dropdown
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      setTemplateVariables({});
      return;
    }

    const tpl = templates.find((t) => t.id === templateId || t._id === templateId);
    if (tpl) {
      setSingleCustomText(tpl.message);

      // Initialize variable inputs
      const vars = {};
      (tpl.variables || []).forEach((v) => {
        vars[v] = '';
      });
      setTemplateVariables(vars);
    }
  };

  // When a template variable value is edited
  const handleVariableChange = (varName, value) => {
    const updatedVars = { ...templateVariables, [varName]: value };
    setTemplateVariables(updatedVars);

    const tpl = templates.find((t) => t.id === selectedTemplateId || t._id === selectedTemplateId);
    if (tpl) {
      let populated = tpl.message;
      Object.entries(updatedVars).forEach(([k, v]) => {
        if (v) {
          populated = populated.replace(new RegExp(`{{${k}}}`, 'g'), v);
        }
      });
      setSingleCustomText(populated);
    }
  };

  // Insert variable tag into message text
  const insertVariableTag = (tag) => {
    setSingleCustomText((prev) => `${prev} {{${tag}}}`.trim());
  };

  // Send single custom message
  const handleSendSingle = async (e) => {
    e.preventDefault();
    if (!singlePhone.trim()) {
      setResult({ type: 'error', message: 'Recipient phone number is required' });
      return;
    }
    if (!singleCustomText.trim()) {
      setResult({ type: 'error', message: 'Message content cannot be empty' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/api/whatsapp/send-custom', {
        customerPhone: singlePhone.trim(),
        message: singleCustomText.trim(),
        customerName: singleCustomerName.trim() || undefined,
      });

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: `WhatsApp message dispatched successfully! ✅ Message ID: ${
          response.messageId || 'Queued'
        }`,
      });
      setSingleCustomText('');
      setSelectedTemplateId('');
      setTemplateVariables({});
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || error.message || 'Failed to send message',
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
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (phoneArray.length === 0) {
        setResult({
          type: 'error',
          message: 'Please enter at least one phone number',
        });
        setLoading(false);
        return;
      }

      const response = await api.post('/api/whatsapp/campaign', {
        phoneNumbers: phoneArray,
        message: bulkMessage,
      });

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: `Campaign complete! ✅ Sent: ${response.sent}, Failed: ${response.failed}`,
      });
      setBulkPhones('');
      setBulkMessage('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send campaign',
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
        caption: imageCaption,
      });

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: 'Image dispatched successfully via SwiftProject Gateway! ✅',
      });
      setImagePhone('');
      setImageUrl('');
      setImageCaption('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send image',
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
        caption: docCaption,
      });

      updateQuotaFromResponse(response);
      setResult({
        type: 'success',
        message: 'Document dispatched successfully! ✅',
      });
      setDocPhone('');
      setDocUrl('');
      setDocFileName('');
      setDocCaption('');
    } catch (error) {
      setResult({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send document',
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
        message: `Gateway test successful! 🚀 Sent to: ${response.to || 'Admin'} (Message ID: ${
          response.messageId || 'OK'
        })`,
      });
    } catch (error) {
      setResult({
        type: 'error',
        message:
          error.response?.data?.error ||
          error.response?.data?.details?.error ||
          error.message ||
          'Test connection failed',
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
            Send custom messages and manage automated WhatsApp updates for Geethika Digital World
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/whatsapp-templates"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            Manage Templates
          </Link>

          {/* Test Connection Button */}
          <button
            onClick={handleTest}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <TestTube className="w-4 h-4" />
            {loading ? 'Testing...' : 'Test Gateway'}
          </button>
        </div>
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
        <div
          className={`p-4 rounded-xl border ${
            result.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
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
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Custom Message
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'bulk'
                ? 'border-emerald-600 text-emerald-600'
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
                ? 'border-emerald-600 text-emerald-600'
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
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Send Document
          </button>
        </div>
      </div>

      {/* Custom Message Tab */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Compose Custom Message</h2>
              <p className="text-sm text-gray-500 mt-1">
                Send a personalized WhatsApp message to any customer or select an existing template
              </p>
            </div>

            <form onSubmit={handleSendSingle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone Number *
                  </label>
                  <input
                    type="text"
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                    placeholder="e.g. 9492686421 or 919492686421"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">10-digit Indian number or with country code</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={singleCustomerName}
                    onChange={(e) => setSingleCustomerName(e.target.value)}
                    placeholder="e.g. Sagar Naidu"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Template Picker */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-emerald-900">
                    Use a Saved Template (Optional)
                  </label>
                  <Link
                    to="/admin/whatsapp-templates"
                    className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    Manage Templates <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="">-- Choose a template to auto-populate --</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id || tpl._id} value={tpl.id || tpl._id}>
                      [{tpl.category?.toUpperCase() || 'CUSTOM'}] {tpl.name}
                    </option>
                  ))}
                </select>

                {/* Variable fields if template selected */}
                {selectedTemplateId && Object.keys(templateVariables).length > 0 && (
                  <div className="pt-2 border-t border-emerald-200/60 space-y-2">
                    <p className="text-xs font-semibold text-emerald-800">Fill Template Variables:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.keys(templateVariables).map((varKey) => (
                        <div key={varKey}>
                          <label className="block text-xs text-gray-600 mb-0.5 font-mono">
                            {`{{${varKey}}}`}
                          </label>
                          <input
                            type="text"
                            value={templateVariables[varKey] || ''}
                            onChange={(e) => handleVariableChange(varKey, e.target.value)}
                            placeholder={`Value for ${varKey}`}
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Message Content *
                  </label>
                  <span className="text-xs text-gray-400">
                    {singleCustomText.length} characters
                  </span>
                </div>

                {/* Quick variable tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="text-xs text-gray-500">Insert:</span>
                  {['name', 'order_number', 'total', 'order_url', 'discount'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertVariableTag(tag)}
                      className="px-2 py-0.5 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 rounded text-xs font-mono transition"
                    >
                      + {`{{${tag}}}`}
                    </button>
                  ))}
                </div>

                <textarea
                  value={singleCustomText}
                  onChange={(e) => setSingleCustomText(e.target.value)}
                  placeholder="Type your WhatsApp message here... You can use WhatsApp formatting like *bold*, _italic_, or emojis! 🎉"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans text-sm"
                  required
                />

                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <Info className="w-3.5 h-3.5" />
                  <span>Formatting: *bold*, _italic_, ~strikethrough~, ```monospace```</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Dispatching Message...' : 'Send WhatsApp Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> WhatsApp Live Preview
            </h3>

            {/* Chat bubble mock */}
            <div className="bg-[#EFEAE2] rounded-xl p-4 flex-1 flex flex-col justify-end min-h-[300px]">
              <div className="bg-white rounded-lg rounded-tl-none p-3.5 shadow-sm max-w-[95%] border border-gray-100">
                <div className="text-xs font-semibold text-emerald-700 mb-1">
                  Geethika Digital World
                </div>

                {singleCustomerName && (
                  <p className="text-xs text-gray-500 mb-1">To: {singleCustomerName}</p>
                )}

                <div className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed break-words">
                  {singleCustomText || (
                    <span className="text-gray-400 italic">
                      Your message preview will appear here as you type...
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-gray-400 text-right mt-1.5 flex items-center justify-end gap-1">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-emerald-500 font-bold">✓✓</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              Recipients receive this message directly on their WhatsApp from your verified business gateway.
            </p>
          </div>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
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
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Send Image Message</h2>
          <form onSubmit={handleSendImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={imagePhone}
                onChange={(e) => setImagePhone(e.target.value)}
                placeholder="e.g. 919492686421"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... or public image link"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Check out your personalized frame design! 🎁"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Image className="w-4 h-4" />
              {loading ? 'Dispatching Image...' : 'Send Image via WhatsApp'}
            </button>
          </form>
        </div>
      )}

      {/* Send Document Tab */}
      {activeTab === 'document' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Send Document / Invoice PDF</h2>
          <form onSubmit={handleSendDocument} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={docPhone}
                onChange={(e) => setDocPhone(e.target.value)}
                placeholder="e.g. 919492686421"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                placeholder="https://example.com/invoice.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={docFileName}
                  onChange={(e) => setDocFileName(e.target.value)}
                  placeholder="invoice-1001.pdf"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <input
                  type="text"
                  value={docCaption}
                  onChange={(e) => setDocCaption(e.target.value)}
                  placeholder="Here is your tax invoice"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {loading ? 'Dispatching Document...' : 'Send Document via WhatsApp'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
