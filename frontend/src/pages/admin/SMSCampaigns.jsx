import { useEffect, useState } from 'react';
import { Send, Users, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../utils/api';

const SMSCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [formData, setFormData] = useState({
    campaign_name: '',
    target_audience: 'all',
    message: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchRecipientPreview(formData.target_audience);
    }
  }, [showModal]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/sms/campaigns');
      setCampaigns(response.campaigns || []);
    } catch (error) {
      console.error('Error fetching SMS campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipientPreview = async (audience) => {
    try {
      setPreviewLoading(true);
      const response = await api.get(`/api/sms/preview?audience=${audience}`);
      setRecipientCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching SMS preview:', error);
      setRecipientCount(0);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleAudienceChange = async (audience) => {
    setFormData({ ...formData, target_audience: audience });
    await fetchRecipientPreview(audience);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/sms/campaigns', formData);
      setShowModal(false);
      setFormData({
        campaign_name: '',
        target_audience: 'all',
        message: '',
      });
      setRecipientCount(0);
      fetchCampaigns();
      alert('SMS campaign sent successfully!');
    } catch (error) {
      console.error('Error creating SMS campaign:', error);
      alert(error.response?.data?.error || 'Failed to send SMS campaign');
    }
  };

  const resetForm = () => {
    setFormData({
      campaign_name: '',
      target_audience: 'all',
      message: '',
    });
    setRecipientCount(0);
  };

  const getStatusBadge = (status) => {
    const badges = {
      sending: { color: 'bg-yellow-100 text-yellow-800', icon: Send },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const badge = badges[status] || badges.sending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SMS Campaigns</h1>
          <p className="text-gray-600 mt-2">Send bulk SMS messages to customers using MSG91</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            fetchRecipientPreview(formData.target_audience);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Send className="w-5 h-5" />
          New SMS Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{campaigns.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Messages Sent</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {campaigns.reduce((sum, campaign) => sum + (campaign.sent_count || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {campaigns.filter((campaign) => campaign.status === 'sending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {campaigns.length > 0
              ? Math.round(
                  (campaigns.reduce((sum, campaign) => sum + (campaign.sent_count || 0), 0) /
                    campaigns.reduce((sum, campaign) => sum + (campaign.total_recipients || 1), 0)) *
                    100
                )
              : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Loading SMS campaigns...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No SMS campaigns found. Create your first campaign!
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.campaign_name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1 max-w-[26rem]">{campaign.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Users className="w-4 h-4" />
                        {campaign.total_recipients} customers
                      </div>
                      <div className="text-sm text-gray-500 capitalize">{campaign.target_audience}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {campaign.sent_count || 0} / {campaign.total_recipients}
                      </div>
                      {campaign.failed_count > 0 && (
                        <div className="text-sm text-red-600">{campaign.failed_count} failed</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(campaign.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Create New SMS Campaign</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    value={formData.campaign_name}
                    onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Diwali SMS Offer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) => handleAudienceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="all">All Customers</option>
                    <option value="active">Active Customers (ordered in last 90 days)</option>
                    <option value="inactive">Inactive Customers (no orders in 90 days)</option>
                    <option value="high_value">High Value Customers (spent &gt; ₹5000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMS Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows="6"
                    placeholder="Write your SMS message here..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Keep the message concise because SMS length affects delivery count.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {previewLoading ? 'Loading recipient preview...' : `${recipientCount} customers will receive this message`}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> SMS delivery uses your MSG91 account and sender ID configured on the server.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Send SMS Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSCampaigns;
