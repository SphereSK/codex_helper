#!/bin/bash
#
# Setup Vibe Coding Template for New Project
#
# Usage: ./setup-vibe-coding.sh <project-name> [--no-git]
#
# Creates new project directory with vibe-coding baseline:
# - GitHub workflows
# - Issue templates
# - Branch protection docs
# - PR template
#
# After running:
# 1. cd <project-name>
# 2. Edit .github/CODEOWNERS (add team usernames)
# 3. Edit ISSUE_GUIDELINES.md (customize for your team)
# 4. git init (if not --no-git)
# 5. git add .github/ *.md
# 6. git commit -m "Add vibe-coding baseline"

set -e

PROJECT_NAME="${1:-}"
NO_GIT="${2:---}"

TEMPLATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Validate input
if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: $0 <project-name> [--no-git]"
    echo ""
    echo "Creates new project with vibe-coding baseline template"
    echo ""
    echo "Examples:"
    echo "  $0 my-api-project"
    echo "  $0 data-pipeline --no-git"
    exit 1
fi

# Check if project already exists
if [ -d "$PROJECT_NAME" ]; then
    echo "❌ Error: Directory '$PROJECT_NAME' already exists"
    exit 1
fi

echo "📦 Creating vibe-coding project: $PROJECT_NAME"
echo ""

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo "📋 Copying template files..."

# Copy .github directory
cp -r "$TEMPLATE_DIR/.github" .

# Copy markdown files
cp "$TEMPLATE_DIR/ISSUE_GUIDELINES.md" .
cp "$TEMPLATE_DIR/BRANCH_PROTECTION.md" .
cp "$TEMPLATE_DIR/SETUP_COMPLETE.md" .
cp "$TEMPLATE_DIR/TEMPLATE_README.md" ./TEMPLATE_SETUP.md

echo "✓ Template files copied"
echo ""

# Initialize git if not --no-git
if [ "$NO_GIT" != "--no-git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git config user.email "${GIT_EMAIL:-you@example.com}"
    git config user.name "${GIT_NAME:-Your Name}"

    # Add files
    git add .github/ *.md

    echo "✓ Git initialized"
    echo ""
    echo "📝 Next steps:"
    echo ""
    echo "1. Edit .github/CODEOWNERS (add team usernames)"
    echo "   nano .github/CODEOWNERS"
    echo ""
    echo "2. Customize ISSUE_GUIDELINES.md for your team"
    echo "   nano ISSUE_GUIDELINES.md"
    echo ""
    echo "3. Commit baseline"
    echo "   git commit -m 'Add vibe-coding baseline'"
    echo ""
    echo "4. Add remote and push"
    echo "   git remote add origin <your-repo-url>"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "5. Enable branch protection in GitHub"
    echo "   See BRANCH_PROTECTION.md for instructions"
    echo ""
else
    echo "ℹ️  Skipped git initialization (--no-git flag)"
    echo ""
    echo "📝 Next steps:"
    echo ""
    echo "1. Edit .github/CODEOWNERS (add team usernames)"
    echo ""
    echo "2. Customize ISSUE_GUIDELINES.md for your team"
    echo ""
    echo "3. Initialize git when ready"
    echo "   git init && git add . && git commit -m 'Initial commit'"
    echo ""
fi

echo "✅ Project created at: $(pwd)"
