import { useAppSettings } from '../../hooks/useAppSettings'
import type { SilenceTimeoutSeconds, VoiceLanguage } from '../../types/appSettings'
import { Select } from '../ui/Select'
import { Toggle } from '../ui/Toggle'
import { SettingsField } from './SettingsField'

export function VoiceSettingsSection() {
  const { settings, updateVoice } = useAppSettings()
  const { voice } = settings

  return (
    <>
      <SettingsField
        id="voice-language"
        label="Voice language"
        hint="Speech recognition language for dictation."
      >
        <Select
          id="voice-language"
          value={voice.language}
          onChange={(e) => updateVoice({ language: e.target.value as VoiceLanguage })}
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
        </Select>
      </SettingsField>

      <SettingsField
        id="silence-timeout"
        label="Silence timeout"
        hint="Automatically stop recording after this period of silence."
      >
        <Select
          id="silence-timeout"
          value={String(voice.silenceTimeoutSeconds)}
          onChange={(e) =>
            updateVoice({
              silenceTimeoutSeconds: Number(e.target.value) as SilenceTimeoutSeconds,
            })
          }
        >
          <option value="5">5 seconds</option>
          <option value="10">10 seconds</option>
          <option value="15">15 seconds</option>
        </Select>
      </SettingsField>

      <Toggle
        id="live-transcript"
        checked={voice.showLiveTranscript}
        onChange={(checked) => updateVoice({ showLiveTranscript: checked })}
        label="Live transcript"
        description="Show speech as you talk while the microphone is active."
      />
    </>
  )
}
