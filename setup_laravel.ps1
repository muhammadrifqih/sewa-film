$ErrorActionPreference = 'Continue'

Write-Host "Backing up custom files..."
Rename-Item app app_custom
Rename-Item database database_custom
Rename-Item resources resources_custom

Write-Host "Creating Laravel project..."
composer create-project laravel/laravel temp_project

Write-Host "Moving Laravel files to root..."
Move-Item temp_project/* . -Force
Move-Item temp_project/.* . -Force
Remove-Item temp_project -Force

Write-Host "Installing Laravel Breeze (Vue + Inertia)..."
composer require laravel/breeze --dev
php artisan breeze:install vue --no-interaction

Write-Host "Restoring custom files..."
Copy-Item -Path app_custom\* -Destination app -Recurse -Force
Copy-Item -Path database_custom\* -Destination database -Recurse -Force
Copy-Item -Path resources_custom\* -Destination resources -Recurse -Force

Write-Host "Cleaning up backups..."
Remove-Item app_custom -Recurse -Force
Remove-Item database_custom -Recurse -Force
Remove-Item resources_custom -Recurse -Force

Write-Host "Installing NPM dependencies & Lucide..."
npm install lucide-vue-next
npm run build

Write-Host "Setup completed successfully."
