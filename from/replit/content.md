# Bring your app from Replit

Start with your application's GitHub repository. Keep the application working while your agent checks what it uses and plans the move.

## How to move your app from Replit

1. Inventory the app: identify the framework, application directory, package manager, auth provider, database, files, functions and external services. Exported source does not automatically include database rows, uploaded files or runtime secrets.
2. Choose what moves: preserve your existing authentication choice unless you request a change. If the repository uses Supabase-specific services, the migration Skill inventories each capability; a package name alone is not a reason to replace it. Some capabilities require source changes or may not fit the supported runtime.
3. Deploy and verify: push the chosen source to GitHub and use the [deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md). Configure the correct environment's secrets, callback URLs and migrations. Test login, protected routes, data reads and writes, and any files or email your app needs. Promote after Dev verification without copying Dev records over Prod data.

[Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) · [Framework guides](https://docs.ohmyho.st/frameworks/vite) · [Application auth](https://docs.ohmyho.st/application-auth) · [Home](/)
