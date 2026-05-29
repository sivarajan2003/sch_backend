import OfferLetterTemplate from '../models/offerlettertemplate.js';

export const getTemplate = async (req, res) => {
    try {
        const template = await OfferLetterTemplate.findOne({
            order: [['createdAt', 'DESC']],
        });

        if (!template) {
            // Return default with all fields
            return res.status(200).json({
                success: true,
                data: {
                    header_title: "ATELIER SCHOOL",
                    header_subtitle: "Excellence in Education",
                    header_logo: "",
                    footer_text: "123 School Lane, Education City\nContact: info@atelier.com | +1 234 567 890",
                    watermark_text: "OFFICIAL OFFER",
                    watermark_image: "",
                    watermark_opacity: 10,
                    show_watermark: true,
                    principal_signature: "",
                    school_seal: ""
                }
            });
        }
        res.status(200).json({ success: true, data: template });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const saveTemplate = async (req, res) => {
    try {
        const template = await OfferLetterTemplate.create(req.body);
        res.status(200).json({ success: true, message: 'Template saved', data: template });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    getTemplate,
    saveTemplate
};
