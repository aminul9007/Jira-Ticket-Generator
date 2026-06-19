import { describe, expect, it } from 'vitest'
import { extensionStateReducer } from '../state/extensionStateReducer'
import { EMPTY_EXTENSION_DRAFT } from '../types/extensionDraft'
import { INITIAL_EXTENSION_STATE } from '../types/extensionState'

describe('extensionStateReducer', () => {
  it('hydrates full draft including voice transcript fallback', () => {
    const state = extensionStateReducer(INITIAL_EXTENSION_STATE, {
      type: 'HYDRATE',
      draft: {
        ...EMPTY_EXTENSION_DRAFT,
        description: '',
        voiceTranscript: 'Login button broken on dashboard',
        workflowView: 'input',
      },
    })

    expect(state.input.description).toBe('Login button broken on dashboard')
    expect(state.voice.transcript).toBe('Login button broken on dashboard')
  })

  it('preserves review workflow when opening settings', () => {
    let state = extensionStateReducer(INITIAL_EXTENSION_STATE, {
      type: 'SET_WORKFLOW_VIEW',
      workflowView: 'review',
    })
    state = extensionStateReducer(state, { type: 'OPEN_SETTINGS' })
    expect(state.ui.view).toBe('settings')
    expect(state.ui.workflowView).toBe('review')

    state = extensionStateReducer(state, { type: 'CLOSE_SETTINGS' })
    expect(state.ui.view).toBe('review')
  })
})
