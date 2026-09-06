# PostHog Self-driving setup report

## Summary
PostHog Self-driving is configured for this Next.js calculator website. Session Replay, Error Tracking, and Support were enabled with server-owned defaults; health, error, and support responders were enabled; and two Replay Vision monitors now feed corroborated findings into the inbox.

Findings should begin appearing in the [Self-driving inbox](https://us.posthog.com/project/595236/inbox) within about 30 minutes.

## AI data processing
Approved by the wizard's organization-level opt-in gate.

## GitHub
The PostHog GitHub App was already connected before this run. GitHub Issues was not enabled as a responder because no connected-tool selection was made.

## Files modified or created

| File | Change |
| --- | --- |
| `posthog-self-driving-report.md` | Created this setup and follow-up record. |

No application source files or environment files were changed; existing PostHog browser initialization already preserved Session Replay and exception capture.

## Products enabled

| Product | Result | App check |
| --- | --- | --- |
| Session Replay | enabled | Browser `posthog.init` has no `disable_session_recording` override. |
| Error Tracking | enabled | Browser `posthog.init` explicitly enables exception capture. |
| Support (Conversations) | enabled | An inbound email, inbox, or Slack channel is still required before tickets arrive. |

## Signal sources

| Signal source | Result |
| --- | --- |
| `signals_scout` / `cross_source_issue` | Deliberately skipped: scout findings are on by default without a config row. |
| `health_checks` / `health_issue` | Enabled (config `01a07246-5a06-74c3-8345-a6628001e1b2`). |
| `error_tracking` / `issue_created` | Enabled (config `01a07246-5964-7ea3-b419-4e70ed490daf`). |
| `error_tracking` / `issue_reopened` | Enabled (config `01a07246-59b6-7035-b514-08e9c46fc59e`). |
| `error_tracking` / `issue_spiking` | Enabled (config `01a07246-5979-70ed-9ffe-a58c6147eb00`). |
| `conversations` / `ticket` | Enabled (config `01a07246-59b5-787a-8c3a-3e81592cfa99`). |
| Session Replay source row | Deliberately skipped: Replay Vision scanners own this route. |

## Connected tools
The connected-tools choice was cancelled, so no external responder was enabled. No tool is reported as newly connected. GitHub Issues, Linear, Jira, Sentry, and Zendesk remain not enabled as Self-driving responders.

## Scout troop
**Enabled (4):** `general`, `web-analytics`, `web-vitals`, and `health-checks`.

| Disabled scout | Reason |
| --- | --- |
| `ai-observability` | No LLM telemetry or AI observability evidence. |
| `anomaly-detection` | No established saved insights or dashboards to monitor. |
| `apm` | No distributed-tracing evidence. |
| `conversations` | Support is newly enabled; no inbound channel is connected yet. |
| `csp-violations` | No CSP reporting evidence. |
| `customer-analytics` | No account/group analytics evidence. |
| `data-pipelines` | No CDP, batch export, or Hog Flow evidence. |
| `data-warehouse` | No warehouse source is connected. |
| `error-tracking` | Covered by the native Error Tracking responders. |
| `experiments` | No active experiment evidence. |
| `feature-flags` | No active feature-flag evidence. |
| `inbox-validation` | Fresh setup has no resolved reports to validate. |
| `insight-alerts` | No configured alert evidence. |
| `logs` | No Logs product evidence. |
| `mcp-tool-calls` | No MCP telemetry surface indicated. |
| `observability-gaps` | Kept selective pending an event history and insight coverage. |
| `product-analytics` | No established product-flow insights evidence. |
| `replay-vision` | New scanners have no accumulated observations yet. |
| `revenue-analytics` | No payment or revenue-data evidence. |
| `session-replay` | Covered by the Replay Vision monitors below. |
| `skills-store` | No team skills-store usage evidence. |
| `surveys` | No surveys exist. |
| `tasks` | No PostHog Tasks usage evidence. |

Verified scout budget: **100 runs/day**, **0 used today**, **100 remaining**. Banner: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts
No custom scout was created: the proposal for calculator search-demand and calculator-engagement checks was declined. The built-in web and health scouts remain the active baseline.

The proposed checks were intentionally narrow: sustained unmatched calculator searches, and calculator-result usage falling while site traffic stays stable. If a future custom scout becomes noisy, set `emit: false` on its config to switch it to dry-run.

## Replay Vision scanners
A scanner is an LLM that watches individual session recordings on a schedule and pushes what it finds to the inbox. These are the only configured items that spend Replay Vision quota. Their findings arrive at half weight and require independent corroboration before promotion into an inbox report.

| Monitor | Result | Scope | Rate | Estimate |
| --- | --- | --- | --- | --- |
| Calculator result breakage | Created | Calculator and AI-calculator URLs, where visitors enter numbers and expect immediate results. | 50% | 0 observations / 0 credits monthly currently; no recordings exist yet. |
| Calculator user frustration | Created | Sessions containing `$rageclick`, with no URL filter. | 100% | 0 observations / 0 credits monthly currently; no recordings exist yet. |

The breakage monitor targets the product's completion flow: producing a calculator or AI-cost result. The monitors are armed and will begin working when recordings arrive.

## Follow-ups
- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled ticket responder can receive requests.
- [ ] Generate browser traffic and replay recordings; both Replay Vision monitors are ready but have no recordings to inspect yet.
- [ ] Optionally enable an external-tool responder later from the [integrations settings](https://us.posthog.com/project/595236/settings/environment-integrations) after selecting the tool and reviewing its draft-PR behavior.

## What happens next
Fresh scout configurations are picked up within about 30 minutes and draw from the daily run budget. Findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/595236/inbox); immediately actionable reports can begin coding tasks.