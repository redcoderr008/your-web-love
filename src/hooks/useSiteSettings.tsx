import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  [key: string]: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');
    
    if (!error && data) {
      const settingsMap: SiteSettings = {};
      data.forEach((item: { key: string; value: string }) => {
        settingsMap[item.key] = item.value;
      });
      setSettings(settingsMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string, defaultValue: string = ''): string => {
    return settings[key] || defaultValue;
  };

  const getSettingAsArray = (key: string, defaultValue: string[] = []): string[] => {
    try {
      const value = settings[key];
      if (value) {
        return JSON.parse(value);
      }
    } catch {
      // Return default if JSON parse fails
    }
    return defaultValue;
  };

  const updateSetting = async (key: string, value: string): Promise<boolean> => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);
    
    if (!error) {
      setSettings(prev => ({ ...prev, [key]: value }));
      return true;
    }
    return false;
  };

  return {
    settings,
    loading,
    getSetting,
    getSettingAsArray,
    updateSetting,
    refetch: fetchSettings,
  };
};
