# Cloudinary Setup Instructions

## Step 1: Create Upload Preset

You need to create an **unsigned upload preset** in Cloudinary to allow client-side uploads.

### Instructions:

1. Go to your Cloudinary Dashboard: https://console.cloudinary.com/
2. Navigate to **Settings** (gear icon) → **Upload** tab
3. Scroll down to **Upload presets** section
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: `digitalstore_products` (or any name you prefer)
   - **Signing Mode**: Select **Unsigned** ⚠️ (Important!)
   - **Folder**: `digitalstore/products`
   - **Allowed formats**: `jpg, png, webp, jpeg`
   - **Max file size**: `5000000` (5MB)
6. Click **Save**
7. Copy the **Preset name** you created

## Step 2: Add to .env

Add these variables to your `.env` file:

```env
PUBLIC_CLOUDINARY_CLOUD_NAME=dylfwf8mt
PUBLIC_CLOUDINARY_UPLOAD_PRESET=digitalstore_products
```

Replace `digitalstore_products` with your actual preset name if you chose a different one.

## Step 3: Restart Dev Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

---

## Verification

Once configured, you'll be able to:
- Upload product images via drag-and-drop
- Images will be stored in Cloudinary at `digitalstore/products/`
- Automatic CDN delivery
- Image optimization enabled
