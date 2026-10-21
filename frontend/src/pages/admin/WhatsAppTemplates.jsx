import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, Send, Eye, Copy, Sparkles, CheckCircle2, Info, Smartphone } from 'lucide-react';
import api from '../../utils/api';

const QUICK_TAGS = [
  { tag: 'name', label: 'Customer Name', desc: 'Customer full name' },
  { tag: 'order_number', label: 'Order #', desc: 'Order ID (e.g. ORD-8921)' },
  { tag: 'total', label: 'Total Amount', desc: 'Order total (e.g. ₹1,499)' },
  { tag: 'details', label: 'Item Details', desc: 'Items and quantities' },
  { tag: 'phone', label: 'Phone', desc: 'Recipient phone number' },
  { tag: 'email', label: 'Email', desc: 'Customer email' },
  { tag: 'order_url', label: 'Order Link', desc: 'Direct link to view order' },
  { tag: 'address', label: 'Address', desc: 'Delivery shipping address' },
  { tag: 'date', label: 'Date', desc: 'Current or estimated date' },
  { tag: 'discount', label: 'Discount', desc: 'Discount percentage' },
  { tag: 'coupon', label: 'Coupon', desc: 'Promotional promo code' },
  { tag: 'shop_url', label: 'Shop Link', desc: 'Store website URL' },
];

const WhatsAppTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState('personalized'); // 'personalized' | 'raw'
  const [modalTab, setModalTab] = useState('editor'); // 'editor' | 'preview'
  const [filterCategory, setFilterCategory] = useState('');
  const [filterOccasion, setFilterOccasion] = useState('');

  const messageTextareaRef = useRef(null);

  // Editable sample data for real-time placeholder testing
  const [sampleData, setSampleData] = useState({
    name: 'Sagar Naidu',
    phone: '+91 9492686421',
    email: 'sagar@geethika.com',
    order_number: 'ORD-8921-X',
    total: '₹1,499',
    details: 'Personalized Acrylic Frame (x1), Photo Mug (x1)',
    address: 'Madhapur, Hyderabad, Telangana - 500081',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    order_url: 'https://geethikadigitalworld.com/order/ORD-8921-X',
    shop_url: 'https://geethikadigitalworld.com/shop',
    discount: '25%',
    coupon: 'FESTIVE25',
  });

  const [formData, setFormData] = useState({
    name: '',
    category: 'promotional',
    occasion: '',
    subject: '',
    message: '',
    variables: []
  });

  useEffect(() => {
    fetchTemplates();
  }, [filterCategory, filterOccasion]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterOccasion) params.append('occasion', filterOccasion);
      
      const response = await api.get(`/api/whatsapp/templates?${params}`);
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const renderSamplePreview = (templateMessage, customSample = sampleData) => {
    if (!templateMessage) return '';
    let text = templateMessage;

    // Direct substitutions
    Object.entries(customSample).forEach(([key, val]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      text = text.replace(regex, val !== undefined && val !== '' ? val : `[${key}]`);
    });

    // Handle common synonyms
    text = text.replace(/{{\s*(customer_name|username|user_name|customername)\s*}}/gi, customSample.name || 'Sagar Naidu');
    text = text.replace(/{{\s*(amount|order_total)\s*}}/gi, customSample.total || '₹1,499');
    text = text.replace(/{{\s*(items|order_details|item_details)\s*}}/gi, customSample.details || 'Personalized Gift Items');
    text = text.replace(/{{\s*(customer_phone|customerphone)\s*}}/gi, customSample.phone || '+91 9492686421');
    text = text.replace(/{{\s*(customer_email|customeremail)\s*}}/gi, customSample.email || 'sagar@geethika.com');
    text = text.replace(/{{\s*(tracking_url)\s*}}/gi, customSample.order_url || 'https://geethikadigitalworld.com/order');
    text = text.replace(/{{\s*(shipping_address)\s*}}/gi, customSample.address || 'Customer Address');
    text = text.replace(/{{\s*(deliverydate|order_date)\s*}}/gi, customSample.date || 'Today');

    return text;
  };

  const insertTagIntoMessage = (tagName) => {
    const tagText = `{{${tagName}}}`;
    const textarea = messageTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart ?? formData.message.length;
      const end = textarea.selectionEnd ?? formData.message.length;
      const newMessage = formData.message.slice(0, start) + tagText + formData.message.slice(end);
      handleMessageChange(newMessage);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tagText.length, start + tagText.length);
      }, 50);
    } else {
      handleMessageChange(`${formData.message} ${tagText}`.trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        const targetId = editingTemplate.id || editingTemplate._id;
        await api.put(`/api/whatsapp/templates/${targetId}`, formData);
      } else {
        await api.post('/api/whatsapp/templates', formData);
      }
      
      setShowModal(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.delete(`/api/whatsapp/templates/${id}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      occasion: template.occasion || '',
      subject: template.subject,
      message: template.message,
      variables: template.variables || []
    });
    setModalTab('editor');
    setShowModal(true);
  };

  const handleDuplicate = (template) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      category: template.category,
      occasion: template.occasion || '',
      subject: template.subject,
      message: template.message,
      variables: template.variables || []
    });
    setModalTab('editor');
    setShowModal(true);
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setPreviewMode('personalized');
    setShowPreview(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'promotional',
      occasion: '',
      subject: '',
      message: '',
      variables: []
    });
    setEditingTemplate(null);
    setModalTab('editor');
  };

  const extractVariables = (text) => {
    const regex = /{{(\w+)}}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  };

  const handleMessageChange = (value) => {
    setFormData(prev => ({
      ...prev,
      message: value,
      variables: extractVariables(value)
    }));
  };

  const getCategoryBadge = (category) => {
    const colors = {
      promotional: 'bg-purple-100 text-purple-800',
      transactional: 'bg-blue-100 text-blue-800',
      notification: 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getOccasionBadge = (occasion) => {
    const colors = {
      valentine: 'bg-pink-100 text-pink-800',
      birthday: 'bg-yellow-100 text-yellow-800',
      festival: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[occasion] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">WhatsApp Templates</h1>
          <p className="text-gray-600 mt-1">
            Create reusable templates with dynamic placeholders like <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-emerald-700">{`{{name}}`}</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-emerald-700">{`{{order_number}}`}</code>, and <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-emerald-700">{`{{details}}`}</code>
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Template
        </button>
      </div>

      {/* Info Alert on Dynamic Placeholders */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900 leading-relaxed">
          <strong>Smart Dynamic Placeholders:</strong> When sending campaigns, single messages, or automated order alerts, placeholders are automatically swapped with each recipient's actual details (name, items, order ID, phone number).
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="">All Categories</option>
              <option value="promotional">Promotional</option>
              <option value="transactional">Transactional</option>
              <option value="notification">Notification</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
            <select
              value={filterOccasion}
              onChange={(e) => setFilterOccasion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="">All Occasions</option>
              <option value="general">General</option>
              <option value="festival">Festival</option>
              <option value="valentine">Valentine's Day</option>
              <option value="birthday">Birthday</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterCategory('');
                setFilterOccasion('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            No templates found. Click <strong>New Template</strong> to create one!
          </div>
        ) : (
          templates.map((template) => (
            <div key={template.id || template._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">{template.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getCategoryBadge(template.category)}`}>
                        {template.category}
                      </span>
                      {template.occasion && (
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getOccasionBadge(template.occasion)}`}>
                          {template.occasion}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{template.subject}</p>
                
                {/* Message preview snippet */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-xs text-gray-700 line-clamp-4 font-sans whitespace-pre-line mb-3">
                  {template.message}
                </div>
                
                {/* Variables Pills */}
                {template.variables && template.variables.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] font-medium text-gray-400 mb-1">Placeholders ({template.variables.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[11px] font-mono rounded">
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-xs transition shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  Preview
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  title="Edit Template"
                  className="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 transition shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDuplicate(template)}
                  title="Duplicate Template"
                  className="p-2 bg-white border border-gray-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(template.id || template._id)}
                  title="Delete Template"
                  className="p-2 bg-white border border-gray-200 text-rose-600 rounded-lg hover:bg-rose-50 transition shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Template Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTemplate ? 'Edit WhatsApp Template' : 'Create New WhatsApp Template'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure your message and dynamic placeholders for automatic personalization
                  </p>
                </div>

                {/* Tab Switcher: Editor vs Live Sample Preview */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setModalTab('editor')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                      modalTab === 'editor'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Template Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('preview')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                      modalTab === 'preview'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Live Preview
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {modalTab === 'editor' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                          Template Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                          placeholder="e.g. Order Confirmation, Festive Discount"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                          Subject / Header *
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                          placeholder="e.g. Order Confirmed, Festive Special"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                          required
                        >
                          <option value="promotional">Promotional</option>
                          <option value="transactional">Transactional (Orders, Payment)</option>
                          <option value="notification">Notification (Shipping, Updates)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                          Occasion (Optional)
                        </label>
                        <select
                          value={formData.occasion}
                          onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                        >
                          <option value="">General</option>
                          <option value="valentine">Valentine's Day</option>
                          <option value="birthday">Birthday</option>
                          <option value="festival">Festival / Holiday</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Placeholder tags toolbar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Insert Dynamic Placeholders:
                        </label>
                        <span className="text-xs text-gray-400">Click to insert at cursor</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                        {QUICK_TAGS.map((t) => (
                          <button
                            key={t.tag}
                            type="button"
                            onClick={() => insertTagIntoMessage(t.tag)}
                            title={t.desc}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-800 rounded text-xs font-mono transition flex items-center gap-1 shadow-2xs"
                          >
                            <span className="text-emerald-600 font-bold">+</span>
                            {`{{${t.tag}}}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Message Body *
                        </label>
                        <span className="text-xs text-gray-400 font-mono">
                          {formData.message.length} chars
                        </span>
                      </div>
                      <textarea
                        ref={messageTextareaRef}
                        value={formData.message}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        rows="7"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-sans text-sm leading-relaxed"
                        placeholder="Hi {{name}}! Your order #{{order_number}} of {{total}} has been confirmed... Use *bold*, _italic_, or emojis! 🎉"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        Variables in curly braces like <code className="bg-gray-100 px-1 rounded text-emerald-700">{`{{name}}`}</code> will be automatically replaced with the recipient customer's real data.
                      </p>
                    </div>
                    
                    {formData.variables.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1.5">Detected Placeholders in this template:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.variables.map((variable, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-medium rounded-full">
                              {`{{${variable}}}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Live Preview inside modal */
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>
                        This preview shows how your message appears on WhatsApp with placeholders replaced by sample customer details:
                      </span>
                    </div>

                    {/* WhatsApp Mock Chat */}
                    <div className="bg-[#EFEAE2] rounded-xl p-5 border border-gray-200 flex flex-col items-center">
                      <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm max-w-[90%] border border-gray-100 w-full space-y-1">
                        <p className="text-xs font-bold text-emerald-700">Geethika Digital World</p>
                        <p className="text-xs text-gray-400 mb-1">To: {sampleData.name} ({sampleData.phone})</p>
                        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">
                          {renderSamplePreview(formData.message) || (
                            <span className="text-gray-400 italic">No message content entered yet...</span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 text-right mt-2 flex items-center justify-end gap-1">
                          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-emerald-500 font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm text-sm"
                  >
                    {editingTemplate ? 'Update Template' : 'Save Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Preview Modal with Interactive Sample Data Testing */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{previewTemplate.name}</h2>
                  <p className="text-xs text-gray-500">{previewTemplate.subject} • [{previewTemplate.category}]</p>
                </div>
                
                {/* Mode toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setPreviewMode('personalized')}
                    className={`px-3 py-1.5 rounded-md transition ${
                      previewMode === 'personalized'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Personalized Preview
                  </button>
                  <button
                    onClick={() => setPreviewMode('raw')}
                    className={`px-3 py-1.5 rounded-md transition ${
                      previewMode === 'raw'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Raw Template Code
                  </button>
                </div>
              </div>

              {previewMode === 'personalized' ? (
                <>
                  {/* WhatsApp Chat Preview */}
                  <div className="bg-[#EFEAE2] rounded-xl p-5 border border-gray-200 flex flex-col items-center">
                    <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm max-w-[95%] border border-gray-100 w-full space-y-1">
                      <p className="text-xs font-bold text-emerald-700">Geethika Digital World</p>
                      <p className="text-[11px] text-gray-400 mb-1">To: {sampleData.name} ({sampleData.phone})</p>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans break-words">
                        {renderSamplePreview(previewTemplate.message)}
                      </div>
                      <div className="text-[10px] text-gray-400 text-right mt-2 flex items-center justify-end gap-1">
                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-emerald-500 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Test Inputs */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Test Sample Customer Data (Live updates above):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-0.5 font-mono">{`{{name}}`}</label>
                        <input
                          type="text"
                          value={sampleData.name}
                          onChange={(e) => setSampleData({ ...sampleData, name: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-0.5 font-mono">{`{{order_number}}`}</label>
                        <input
                          type="text"
                          value={sampleData.order_number}
                          onChange={(e) => setSampleData({ ...sampleData, order_number: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 mb-0.5 font-mono">{`{{total}}`}</label>
                        <input
                          type="text"
                          value={sampleData.total}
                          onChange={(e) => setSampleData({ ...sampleData, total: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Raw message view */
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Raw Message Code with Placeholders:</p>
                  <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {previewTemplate.message}
                  </div>
                </div>
              )}

              {previewTemplate.variables && previewTemplate.variables.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Detected Template Variables:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {previewTemplate.variables.map((variable, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono rounded-md">
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowPreview(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition text-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppTemplates;
