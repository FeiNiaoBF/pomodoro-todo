import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SettingsStorage } from '../utils/StorageService';
import { TimerConfig, DEFAULT_TIMER_CONFIG } from '../types';

/**
 * SettingsScreen - 设置页面
 *
 * 包含：
 * - 计时器时长配置
 * - 主题设置（预留）
 * - 通知设置（预留）
 * - 数据管理
 */
export function SettingsScreen() {
  const [config, setConfig] = useState<TimerConfig>(DEFAULT_TIMER_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  // 初始加载
  useEffect(() => {
    SettingsStorage.getSettings().then(setConfig);
  }, []);

  // 保存设置
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SettingsStorage.saveSettings(config);
      setIsSaving(false);
      // 可以显示 toast 提示保存成功
    } catch (error) {
      console.error('Failed to save settings:', error);
      setIsSaving(false);
    }
  };

  // 重置为默认值
  const handleReset = () => {
    setConfig(DEFAULT_TIMER_CONFIG);
  };

  const updateConfig = (key: keyof TimerConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚙️ 设置</Text>
        </View>

        {/* 计时器设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ 计时器配置</Text>

          {/* 专注时长 */}
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingName}>专注时长 (分钟)</Text>
              <Text style={styles.settingDesc}>单次番茄的长度</Text>
            </View>
            <View style={styles.settingControl}>
              <TouchableOpacity
                style={styles.minusBtn}
                onPress={() =>
                  updateConfig('focusDuration', Math.max(5, config.focusDuration - 1))
                }
              >
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={String(config.focusDuration)}
                keyboardType="number-pad"
                editable={true}
                onChangeText={v => {
                  const num = parseInt(v, 10);
                  if (!isNaN(num) && num > 0) {
                    updateConfig('focusDuration', num);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() =>
                  updateConfig('focusDuration', config.focusDuration + 1)
                }
              >
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 短休息时长 */}
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingName}>短休息 (分钟)</Text>
              <Text style={styles.settingDesc}>每个番茄后的休息</Text>
            </View>
            <View style={styles.settingControl}>
              <TouchableOpacity
                style={styles.minusBtn}
                onPress={() =>
                  updateConfig('shortBreakDuration', Math.max(1, config.shortBreakDuration - 1))
                }
              >
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={String(config.shortBreakDuration)}
                keyboardType="number-pad"
                editable={true}
                onChangeText={v => {
                  const num = parseInt(v, 10);
                  if (!isNaN(num) && num > 0) {
                    updateConfig('shortBreakDuration', num);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() =>
                  updateConfig('shortBreakDuration', config.shortBreakDuration + 1)
                }
              >
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 长休息时长 */}
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingName}>长休息 (分钟)</Text>
              <Text style={styles.settingDesc}>每 4 个番茄后的长休息</Text>
            </View>
            <View style={styles.settingControl}>
              <TouchableOpacity
                style={styles.minusBtn}
                onPress={() =>
                  updateConfig('longBreakDuration', Math.max(5, config.longBreakDuration - 1))
                }
              >
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={String(config.longBreakDuration)}
                keyboardType="number-pad"
                editable={true}
                onChangeText={v => {
                  const num = parseInt(v, 10);
                  if (!isNaN(num) && num > 0) {
                    updateConfig('longBreakDuration', num);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() =>
                  updateConfig('longBreakDuration', config.longBreakDuration + 1)
                }
              >
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 长休息间隔 */}
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingName}>长休息间隔</Text>
              <Text style={styles.settingDesc}>多少个番茄后休长休息</Text>
            </View>
            <View style={styles.settingControl}>
              <TouchableOpacity
                style={styles.minusBtn}
                onPress={() =>
                  updateConfig('longBreakInterval', Math.max(1, config.longBreakInterval - 1))
                }
              >
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={String(config.longBreakInterval)}
                keyboardType="number-pad"
                editable={true}
                onChangeText={v => {
                  const num = parseInt(v, 10);
                  if (!isNaN(num) && num > 0) {
                    updateConfig('longBreakInterval', num);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() =>
                  updateConfig('longBreakInterval', config.longBreakInterval + 1)
                }
              >
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 按钮组 */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>
              {isSaving ? '保存中...' : '保存设置'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleReset}
          >
            <Text style={styles.buttonSecondaryText}>恢复默认</Text>
          </TouchableOpacity>
        </View>

        {/* 关于部分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ 关于</Text>
          <Text style={styles.aboutText}>
            🍅 Pomodoro Todo v0.1.0
          </Text>
          <Text style={styles.aboutText}>
            本地数据存储，完全离线使用
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  settingLabel: {
    flex: 1,
  },
  settingName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 11,
    color: '#999',
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  minusBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
  },
  input: {
    width: 50,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    gap: 10,
    marginVertical: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#E53935',
  },
  buttonSecondary: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  buttonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  aboutText: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
});
