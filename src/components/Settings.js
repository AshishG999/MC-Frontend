import React, { useEffect, useState } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';

function Settings() {
  const [settings, setSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    twilioSid: '',
    twilioAuth: '',
    twilioFrom: '',
  });

  const loadSettings = async () => {
    try {
      // Optionally, fetch saved settings from backend if stored in DB
      const res = await fetchWrapper.get('/settings');
      if (res.data) setSettings(res.data);
    } catch (err) {
      console.error('Could not load settings', err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Save/update settings via backend API
      await fetchWrapper.post('/settings', settings);
      alert('Settings saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
  };

  return (
    <div>
      <h3>System Settings</h3>
      <form onSubmit={handleSave}>
        <h5>Email (SMTP)</h5>
        <div className="mb-2">
          <label className="form-label">SMTP Host</label>
          <input type="text" name="smtpHost" className="form-control" value={settings.smtpHost} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">SMTP Port</label>
          <input type="number" name="smtpPort" className="form-control" value={settings.smtpPort} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">SMTP User</label>
          <input type="email" name="smtpUser" className="form-control" value={settings.smtpUser} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">SMTP Password</label>
          <input type="password" name="smtpPass" className="form-control" value={settings.smtpPass} onChange={handleChange} required />
        </div>

        <h5 className="mt-3">SMS (Twilio)</h5>
        <div className="mb-2">
          <label className="form-label">Twilio SID</label>
          <input type="text" name="twilioSid" className="form-control" value={settings.twilioSid} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label className="form-label">Twilio Auth Token</label>
          <input type="text" name="twilioAuth" className="form-control" value={settings.twilioAuth} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label className="form-label">Twilio From Number</label>
          <input type="text" name="twilioFrom" className="form-control" value={settings.twilioFrom} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary mt-3">Save Settings</button>
      </form>
    </div>
  );
}

export default Settings;
