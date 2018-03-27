import CMS from "netlify-cms";

import HomePreview from "./preview-templates/HomePreview";

// CMS.registerPreviewStyle('/styles.css')
CMS.registerPreviewTemplate("Home", HomePreview);
