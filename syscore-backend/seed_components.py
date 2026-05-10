from dotenv import load_dotenv
load_dotenv()

from app import create_app
from app.extensions import db
from app.models.component import Component

app = create_app()

components_data = [
    {
        "name": "STANDARD_TEXT_INPUT",
        "slug": "standard-text-input",
        "category": "Input",
        "tier": "free",
        "preview_label": "[ INPUT.FIELD ]",
        "tags": "form,input,text",
        "code_html": """
<div class="sys-field">
  <label class="sys-label">
    FIELD_LABEL
  </label>
  <input
    type="text"
    class="sys-input"
    placeholder="ENTER_VALUE_"
  />
</div>
<style>
  .sys-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sys-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    color: #888;
    text-transform: uppercase;
  }
  .sys-input {
    background: #1a1a1a;
    border: 1px solid #222;
    border-radius: 2px;
    padding: 8px 12px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #e0e0e0;
    outline: none;
    width: 280px;
  }
  .sys-input:focus {
    border-color: #f5c518;
  }
  .sys-input::placeholder {
    color: #333;
  }
</style>
"""
    },
    {
        "name": "COLLAPSIBLE_SIDEBAR",
        "slug": "collapsible-sidebar",
        "category": "Navigation",
        "tier": "pro",
        "preview_label": "[ NAV.SIDEBAR ]",
        "tags": "navigation,sidebar,layout",
        "code_html": """
<div class="sys-sidebar">
  <div class="sys-nav-item">DASHBOARD</div>
  <div class="sys-nav-item active">GALLERY</div>
  <div class="sys-nav-item">RESOURCES</div>
</div>
<style>
  .sys-sidebar {
    width: 148px;
    height: 100%;
    background: #0f0f0f;
    border-right: 1px solid #222;
    padding: 20px 0;
  }
  .sys-nav-item {
    padding: 10px 20px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: #555;
    cursor: pointer;
  }
  .sys-nav-item.active {
    color: #f5c518;
    background: #141414;
    border-left: 2px solid #f5c518;
  }
</style>
"""
    },
    {
        "name": "DATA_METRIC_CARD",
        "slug": "data-metric-card",
        "category": "Card",
        "tier": "free",
        "preview_label": "[ CARD.METRIC ]",
        "tags": "card,metric,dashboard",
        "code_html": """
<div class="sys-card">
  <div class="sys-metric-label">TOTAL_REQUESTS</div>
  <div class="sys-metric-value">128.5K</div>
</div>
<style>
  .sys-card {
    background: #141414;
    border: 1px solid #222;
    padding: 16px;
    width: 200px;
  }
  .sys-metric-label {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    color: #888;
  }
  .sys-metric-value {
    font-family: 'Space Mono', monospace;
    font-size: 24px;
    color: #f5c518;
    margin-top: 4px;
  }
</style>
"""
    },
    {
        "name": "ACTION_MODAL",
        "slug": "action-modal",
        "category": "Overlay",
        "tier": "pro",
        "preview_label": "[ OVERLAY.MODAL ]",
        "tags": "modal,overlay,dialog",
        "code_html": """
<div class="sys-modal-backdrop">
  <div class="sys-modal">
    <div class="sys-modal-header">CONFIRM_ACTION</div>
    <div class="sys-modal-body">PROCEED WITH SYSTEM OVERRIDE?</div>
    <div class="sys-modal-footer">
      <button class="sys-btn secondary">CANCEL</button>
      <button class="sys-btn primary">PROCEED</button>
    </div>
  </div>
</div>
<style>
  .sys-modal-backdrop {
    background: rgba(0,0,0,0.8);
    padding: 40px;
  }
  .sys-modal {
    background: #141414;
    border: 1px solid #222;
    width: 300px;
  }
  .sys-modal-header {
    background: #1a1a1a;
    padding: 8px 12px;
    border-bottom: 1px solid #222;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: #f5c518;
  }
  .sys-modal-body {
    padding: 20px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #e0e0e0;
  }
  .sys-modal-footer {
    padding: 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  .sys-btn {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    padding: 4px 12px;
    border: 1px solid #222;
    cursor: pointer;
  }
  .sys-btn.primary { background: #f5c518; color: #000; }
  .sys-btn.secondary { background: #1a1a1a; color: #888; }
</style>
"""
    },
    {
        "name": "SORTABLE_DATA_GRID",
        "slug": "sortable-data-grid",
        "category": "Data",
        "tier": "free",
        "preview_label": "[ DATA.TABLE ]",
        "tags": "table,grid,data",
        "code_html": """
<table class="sys-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>STATUS</th>
      <th>TIMESTAMP</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>#4021</td><td>ACTIVE</td><td>12:04:11</td></tr>
    <tr><td>#4022</td><td>FAILED</td><td>12:05:01</td></tr>
    <tr><td>#4023</td><td>ACTIVE</td><td>12:06:55</td></tr>
  </tbody>
</table>
<style>
  .sys-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Space Mono', monospace;
  }
  .sys-table th {
    text-align: left;
    background: #1a1a1a;
    color: #888;
    font-size: 9px;
    padding: 8px;
    border-bottom: 1px solid #222;
  }
  .sys-table td {
    color: #e0e0e0;
    font-size: 10px;
    padding: 8px;
    border-bottom: 1px solid #141414;
  }
</style>
"""
    },
    {
        "name": "CUSTOM_DROPDOWN",
        "slug": "custom-dropdown",
        "category": "Input",
        "tier": "pro",
        "preview_label": "[ INPUT.SELECT ]",
        "tags": "form,select,dropdown",
        "code_html": """
<div class="sys-select-container">
  <select class="sys-select">
    <option>SELECT_TIER_</option>
    <option>TIER_1</option>
    <option>TIER_2</option>
  </select>
</div>
<style>
  .sys-select {
    background: #1a1a1a;
    border: 1px solid #222;
    color: #e0e0e0;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    padding: 8px 12px;
    width: 200px;
    appearance: none;
    border-radius: 2px;
  }
  .sys-select-container {
    position: relative;
  }
  .sys-select-container::after {
    content: '▼';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #f5c518;
    font-size: 8px;
    pointer-events: none;
  }
</style>
"""
    }
]

def seed():
    with app.app_context():
        # Clear existing
        Component.query.delete()
        
        for data in components_data:
            component = Component(**data)
            db.session.add(component)
        
        db.session.commit()
        print(f"Successfully seeded {len(components_data)} components.")

if __name__ == "__main__":
    seed()
