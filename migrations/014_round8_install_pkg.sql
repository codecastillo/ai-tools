-- Round 8 follow-up: convert :::os tabs to either a single bash block (when
-- the install command is identical across operating systems) or to :::pkg
-- tabs (when the command genuinely varies by package manager).
--
-- The user pointed out that for most AI dev tools the OS doesn't change the
-- command, the package handler does. So MACOS/LINUX/WINDOWS tabs were noise.

-- VS Code extensions: same one-liner everywhere, no tabs needed.
UPDATE tools SET install_md = $$```bash
# Install the GitHub Copilot extension from the VS Code marketplace
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
```$$ WHERE slug = 'github-copilot';

UPDATE tools SET install_md = $$```bash
# Install the Codeium extension for VS Code (works in JetBrains too via marketplace)
code --install-extension Codeium.codeium
```$$ WHERE slug = 'codeium';

UPDATE tools SET install_md = $$```bash
# Install the Tabnine extension from the VS Code marketplace
code --install-extension TabNine.tabnine-vscode
```$$ WHERE slug = 'tabnine';

UPDATE tools SET install_md = $$```bash
# Install the Cody extension for VS Code or JetBrains
code --install-extension sourcegraph.cody-ai
```$$ WHERE slug = 'sourcegraph-cody';

-- Desktop apps: real differences per package manager, use :::pkg tabs.
UPDATE tools SET install_md = $$:::pkg brew
```bash
brew install --cask windsurf
```
:::
:::pkg winget
```powershell
winget install Codeium.Windsurf
```
:::
:::pkg apt
```bash
# Download the .deb from https://windsurf.com/download then:
sudo apt install ./windsurf-*.deb
```
:::$$ WHERE slug = 'windsurf';

UPDATE tools SET install_md = $$:::pkg brew
```bash
brew install --cask pieces-os pieces
```
:::
:::pkg winget
```powershell
winget install Pieces.Pieces
```
:::
:::pkg apt
```bash
# Download the .deb from https://pieces.app/install then:
sudo apt install ./pieces-*.deb
```
:::$$ WHERE slug = 'pieces';

-- JetBrains AI: ships inside the JetBrains IDE. brew on Mac, the JetBrains
-- Toolbox on Linux/Windows. Combine the toolbox path into a single :::pkg cli
-- tab because Toolbox handles all three OSes.
UPDATE tools SET install_md = $$:::pkg brew
```bash
# 1) Install or update your JetBrains IDE
brew install --cask intellij-idea
# 2) Open the IDE and enable AI Assistant from Settings -> Plugins
```
:::
:::pkg cli
```bash
# Install JetBrains Toolbox, then use it to install / update IDEs.
# Download from: https://www.jetbrains.com/toolbox-app/
# Once an IDE is installed, enable AI Assistant from Settings -> Plugins.
```
:::$$ WHERE slug = 'jetbrains-ai';
