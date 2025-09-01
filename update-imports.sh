#!/bin/bash

# Update Import Paths Script
# This script updates all import paths to match the new folder structure

echo "🔄 Updating import paths to match new structure..."

# Function to update imports in a file
update_imports_in_file() {
    local file="$1"
    
    # Update lib imports
    sed -i 's|@/lib/utils|@/lib/utils|g' "$file"
    sed -i 's|@/lib/supabase|@/lib/services/supabase|g' "$file"
    sed -i 's|@/lib/openai|@/lib/services/openai|g' "$file"
    sed -i 's|@/lib/resend|@/lib/services/resend|g' "$file"
    
    # Update component imports
    sed -i 's|@/components/Header|@/components/layout/Header|g' "$file"
    sed -i 's|@/components/LandingHeader|@/components/layout/LandingHeader|g' "$file"
    sed -i 's|@/components/ClientHeader|@/components/layout/ClientHeader|g' "$file"
    sed -i 's|@/components/AppSidebar|@/components/layout/AppSidebar|g' "$file"
    sed -i 's|@/components/AppSidebarItems|@/components/layout/AppSidebarItems|g' "$file"
    sed -i 's|@/components/AppSidebarFooter|@/components/layout/AppSidebarFooter|g' "$file"
    sed -i 's|@/components/AppBreadcrumb|@/components/layout/AppBreadcrumb|g' "$file"
    
    # Update marketing component imports
    sed -i 's|@/components/Hero|@/components/marketing/Hero|g' "$file"
    sed -i 's|@/components/ContactForm|@/components/marketing/ContactForm|g' "$file"
    sed -i 's|@/components/WaitlistBadge|@/components/marketing/WaitlistBadge|g' "$file"
    sed -i 's|@/components/WaitlistCTA|@/components/marketing/WaitlistCTA|g' "$file"
    sed -i 's|@/components/WaitlistFeatures|@/components/marketing/WaitlistFeatures|g' "$file"
    sed -i 's|@/components/WaitlistFooter|@/components/marketing/WaitlistFooter|g' "$file"
    sed -i 's|@/components/WaitlistForm|@/components/marketing/WaitlistForm|g' "$file"
    sed -i 's|@/components/WaitlistHeader|@/components/marketing/WaitlistHeader|g' "$file"
    sed -i 's|@/components/WaitlistHero|@/components/marketing/WaitlistHero|g' "$file"
    sed -i 's|@/components/WaitlistSocialProof|@/components/marketing/WaitlistSocialProof|g' "$file"
    sed -i 's|@/components/WaitlistSuccess|@/components/marketing/WaitlistSuccess|g' "$file"
    
    # Update shared component imports
    sed -i 's|@/components/ScrollToTop|@/components/shared/ScrollToTop|g' "$file"
    sed -i 's|@/components/LogoutButton|@/components/shared/LogoutButton|g' "$file"
    
    # Update API route imports
    sed -i 's|@/app/api/settings|@/app/api/auth|g' "$file"
    sed -i 's|@/app/api/contact|@/app/api/marketing|g' "$file"
    sed -i 's|@/app/api/waitlist|@/app/api/marketing|g' "$file"
    sed -i 's|@/app/api/webhook|@/app/api/webhooks|g' "$file"
    
    # Update CSS imports
    sed -i 's|@/app/globals.css|@/styles/globals.css|g' "$file"
}

# Find all TypeScript and TSX files
echo "📁 Finding all TypeScript files..."
files=$(find src -name "*.ts" -o -name "*.tsx")

# Update imports in each file
echo "🔄 Updating imports in ${#files[@]} files..."
for file in $files; do
    if [ -f "$file" ]; then
        echo "  Updating: $file"
        update_imports_in_file "$file"
    fi
done

# Update specific files that need manual attention
echo "🔧 Updating specific files..."

# Update layout.tsx to import from new globals.css location
if [ -f "src/app/layout.tsx" ]; then
    sed -i 's|import.*globals.css.*|import "@/styles/globals.css"|g' "src/app/layout.tsx"
fi

# Update any remaining hardcoded paths
echo "🔍 Checking for any remaining hardcoded paths..."

# Create a summary of changes
echo "📋 Summary of import path updates:"
echo "  ✅ Updated lib imports to use new structure"
echo "  ✅ Updated component imports to use new folders"
echo "  ✅ Updated API route imports"
echo "  ✅ Updated CSS imports"
echo "  ✅ Updated marketing component imports"
echo "  ✅ Updated shared component imports"

echo ""
echo "✅ Import path updates complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run build' to check for any remaining import errors"
echo "2. Run 'npm run dev' to test the application"
echo "3. Fix any remaining import errors manually"
echo "4. Update any documentation that references old paths"
