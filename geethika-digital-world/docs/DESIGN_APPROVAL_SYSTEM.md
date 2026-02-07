# Design Approval System - Implementation Complete

## ✅ What's Been Implemented

### 1. Database Structure
- Created `design_approvals` table with the following fields:
  - `id`: Primary key
  - `order_item_id`: Links to order items
  - `customer_uploaded_images`: Array of customer images
  - `admin_designed_image`: Admin's designed image
  - `status`: Design approval status
  - `customer_feedback`: Customer's revision feedback
  - `revision_count`: Number of revisions requested
  - `approved_at`: Approval timestamp

### 2. Backend API Routes (`/api/designs`)
- `GET /order-item/:orderItemId` - Get design approval details
- `POST /upload/:orderItemId` - Admin uploads designed image
- `POST /approve/:orderItemId` - Customer approves design
- `POST /request-revision/:orderItemId` - Customer requests redesign
- `GET /pending` - Admin views all pending designs

### 3. Admin Features (Order Management)
✅ **View Customer Uploaded Images**
- Admin can see all images uploaded by customers
- Images displayed in a grid with download buttons
- Click download icon to save images locally

✅ **Upload Designed Images**
- Upload section appears for items with customer images
- Supports image and PDF files (up to 10MB)
- One-click upload with progress indicator

✅ **Track Design Status**
- pending_design: Waiting for admin to upload
- pending_approval: Design uploaded, waiting for customer
- approved: Customer approved
- revision_requested: Customer wants changes

### 4. Customer Features (Order Detail Page)
To complete the customer-side implementation, add this to `OrderDetailPage.jsx`:

```javascript
// Add these imports at the top
import { Download, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

// Add this state
const [designApprovals, setDesignApprovals] = useState({});
const [revisionFeedback, setRevisionFeedback] = useState({});

// Add this function to fetch design approvals
const fetchDesignApprovals = async (orderItems) => {
  const approvals = {};
  for (const item of orderItems) {
    if (item.customization_images && item.customization_images.length > 0) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/designs/order-item/${item.id}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          approvals[item.id] = data.design;
        }
      } catch (error) {
        console.error('Error fetching design approval:', error);
      }
    }
  }
  setDesignApprovals(approvals);
};

// Call this after fetching order
useEffect(() => {
  if (order?.items) {
    fetchDesignApprovals(order.items);
  }
}, [order]);

// Add these handler functions
const handleApproveDesign = async (orderItemId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/designs/approve/${orderItemId}`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (response.ok) {
      alert('Design approved! Your order will be processed.');
      fetchOrderDetails();
    }
  } catch (error) {
    console.error('Error approving design:', error);
    alert('Failed to approve design');
  }
};

const handleRequestRevision = async (orderItemId) => {
  const feedback = revisionFeedback[orderItemId];
  if (!feedback) {
    alert('Please provide feedback for the revision');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/designs/request-revision/${orderItemId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ feedback })
      }
    );
    
    if (response.ok) {
      alert('Revision requested! We will update the design.');
      setRevisionFeedback({ ...revisionFeedback, [orderItemId]: '' });
      fetchOrderDetails();
    }
  } catch (error) {
    console.error('Error requesting revision:', error);
    alert('Failed to request revision');
  }
};
```

### 5. UI Components to Add

Add this section in the order items display:

```jsx
{/* Design Approval Section */}
{item.customization_images && item.customization_images.length > 0 && (
  <div className="mt-4 border-t pt-4">
    <h4 className="font-semibold mb-2">Design Approval</h4>
    
    {/* Customer's Uploaded Images */}
    <div className="mb-3">
      <p className="text-sm text-gray-600 mb-2">Your Uploaded Images:</p>
      <div className="grid grid-cols-4 gap-2">
        {item.customization_images.map((img, idx) => (
          <img
            key={idx}
            src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}${img}`}
            alt={`Upload ${idx + 1}`}
            className="w-full h-20 object-cover rounded border"
          />
        ))}
      </div>
    </div>

    {/* Admin's Designed Image */}
    {designApprovals[item.id]?.admin_designed_image && (
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm font-semibold mb-2">Our Design for You:</p>
        <img
          src={`${import.meta.env.VITE_API_URL}${designApprovals[item.id].admin_designed_image}`}
          alt="Designed"
          className="w-full max-w-md rounded border mb-3"
        />
        
        {designApprovals[item.id].status === 'pending_approval' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Please review the design and approve or request changes:
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveDesign(item.id)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Design
              </button>
              <button
                onClick={() => {
                  const feedback = prompt('Please describe the changes you want:');
                  if (feedback) {
                    setRevisionFeedback({ ...revisionFeedback, [item.id]: feedback });
                    handleRequestRevision(item.id);
                  }
                }}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Request Changes
              </button>
            </div>
          </div>
        )}
        
        {designApprovals[item.id].status === 'approved' && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Design Approved!</span>
          </div>
        )}
        
        {designApprovals[item.id].status === 'revision_requested' && (
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded">
            <p className="font-semibold mb-1">Revision Requested</p>
            <p className="text-sm">We're working on your requested changes.</p>
            {designApprovals[item.id].customer_feedback && (
              <p className="text-sm mt-2 italic">
                Your feedback: "{designApprovals[item.id].customer_feedback}"
              </p>
            )}
          </div>
        )}
      </div>
    )}
    
    {!designApprovals[item.id]?.admin_designed_image && (
      <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded text-sm">
        ⏳ Our design team is working on your customization. You'll be notified when ready!
      </div>
    )}
  </div>
)}
```

## 📋 Workflow

### For Customers:
1. Order a customizable product
2. Upload images during checkout
3. Wait for admin to design
4. Receive notification when design is ready
5. View design in "My Orders"
6. Either:
   - ✅ Approve → Order proceeds to production
   - 🔄 Request changes → Admin redesigns

### For Admin:
1. Go to Order Management
2. Click "View" on any order
3. See customer-uploaded images
4. Download images if needed
5. Create design offline
6. Upload designed image
7. Customer gets notified
8. If revision requested, repeat from step 5

## 🚀 Next Steps

1. **Add Email Notifications**
   - Notify customer when design is uploaded
   - Notify admin when revision is requested

2. **Add WhatsApp Integration**
   - Send design via WhatsApp
   - Get approval via WhatsApp

3. **Add Design History**
   - Show all previous designs
   - Track revision history

## 📁 Files Modified/Created

### Backend:
- ✅ `scripts/create-design-approval-table.js` - Database setup
- ✅ `routes/designs.js` - API endpoints
- ✅ `server.js` - Added design routes
- ✅ `uploads/designs/` - Storage folder

### Frontend:
- ✅ `components/OrderDetailsModal.jsx` - Admin view with upload
- ✅ `pages/admin/OrderManagement.jsx` - Updated to use new modal
- ⏳ `pages/OrderDetailPage.jsx` - Customer approval UI (code provided above)

## 🎯 Status

- ✅ Database structure created
- ✅ Backend API complete
- ✅ Admin upload functionality working
- ✅ Customer image viewing working
- ⏳ Customer approval UI (code provided, needs to be added)
- ⏳ Notifications (future enhancement)

## 🔧 Testing

1. Create an order with customizable product
2. Upload images during checkout
3. Login as admin
4. View order and upload design
5. Login as customer
6. View order and approve/request revision

