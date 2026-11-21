import DesignRequest from '../models/DesignRequest.js';
import Product from '../models/Product.js';

export const createDesignRequest = async (req, res) => {
  try {
    const { title, description, productId, specs, referenceFiles, guestDetails } = req.body;

    const requestNumber = 'REQ-' + Date.now().toString().substring(4) + Math.floor(Math.random() * 90 + 10);

    const designReq = await DesignRequest.create({
      requestNumber,
      customer: req.user ? req.user._id : null,
      guestDetails: req.user ? undefined : guestDetails,
      product: productId || null,
      title,
      description,
      specs: specs || {},
      referenceFiles: referenceFiles || [],
      status: 'pending_proof'
    });

    return res.status(201).json({ success: true, data: designReq });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDesignRequests = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'customer') {
      query.customer = req.user._id;
    }

    const requests = await DesignRequest.find(query)
      .populate('customer', 'name email phone')
      .populate('product', 'name images')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDesignRequestById = async (req, res) => {
  try {
    const request = await DesignRequest.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('product', 'name images');

    if (!request) return res.status(404).json({ success: false, message: 'Design request not found' });
    return res.json({ success: true, data: request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProof = async (req, res) => {
  try {
    const { proofUrl, notes } = req.body;
    const request = await DesignRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Design request not found' });

    const nextVersion = request.proofs.length + 1;
    const newProof = {
      proofUrl,
      notes: notes || 'Proof version ' + nextVersion,
      version: nextVersion,
      uploadedBy: req.user ? req.user.name : 'Staff',
      uploadedAt: new Date(),
      status: 'pending_review'
    };

    request.proofs.push(newProof);
    request.status = 'proof_uploaded';
    await request.save();

    return res.json({ success: true, message: 'Design proof uploaded successfully', data: request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const customerProofFeedback = async (req, res) => {
  try {
    const { proofId, action, feedback } = req.body;
    const request = await DesignRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Design request not found' });

    const proof = request.proofs.id(proofId) || request.proofs[request.proofs.length - 1];
    if (!proof) return res.status(404).json({ success: false, message: 'Proof file not found' });

    if (action === 'approve') {
      proof.status = 'approved';
      request.status = 'approved';
    } else {
      proof.status = 'revision_requested';
      proof.customerFeedback = feedback || 'Revision requested';
      request.status = 'revision_requested';
    }

    await request.save();
    return res.json({
      success: true,
      message: action === 'approve' ? 'Proof approved successfully!' : 'Revision request submitted',
      data: request
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
