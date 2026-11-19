# Icon catalog (Fieldnotes packs)

Insert icons with `H.icon(id, {...})`. Choose icons by **meaning**, not by the pack title: a hospital "Waiting room" icon works well as "dormant" or "waiting", and "Explore trade-offs" works as "value vs volume".

Style: ink `#243449`, pastel fills (teal `#c9e8df`, blue `#d8e7fa`, amber `#fae5b8`, coral `#f6d5ce`), red `#ac4b45` for negatives only, stroke 2.2, roughness 0.65. They fit pale card fills without recoloring.

## A052 · Patient appointment journey

| ID | Name | Meaning |
|---|---|---|
| `A052-icon-01` | Find a clinician | Compare suitable care providers. |
| `A052-icon-02` | Book an appointment | Request a visit using a booking interface. |
| `A052-icon-03` | Choose a time | Select an available appointment slot. |
| `A052-icon-04` | Appointment confirmed | A requested visit is now scheduled. |
| `A052-icon-05` | Visit reminder | An upcoming visit needs attention. |
| `A052-icon-06` | Pre-visit questionnaire | Complete questions before the visit. |
| `A052-icon-07` | Bring records | Prepare existing medical documents. |
| `A052-icon-08` | Access accommodation | Arrange step-free access or mobility support. |
| `A052-icon-09` | Arrival and check-in | Register arrival at the reception desk. |
| `A052-icon-10` | Waiting room | Wait until the care team is ready. |
| `A052-icon-11` | Vitals check | Measure basic observations before consultation. |
| `A052-icon-12` | Clinical consultation | Discuss concerns with a care professional. |
| `A052-icon-13` | Diagnostic referral | Move from a visit to an ordered diagnostic service. |
| `A052-icon-14` | Prescription | Receive a medication plan from the clinician. |
| `A052-icon-15` | Follow-up plan | Schedule a next visit after the current one. |
| `A052-icon-16` | Reschedule a visit | Move an existing booking to a different slot. |
| `A052-icon-17` | Cancel a visit | Remove a scheduled visit without replacing it. |
| `A052-icon-18` | Telehealth visit | Consult remotely through a video connection. |

## B004 · Human approval in AI workflows

| ID | Name | Meaning |
|---|---|---|
| `B004-icon-01` | AI-proposed action | A model produces a proposed action, not an executed one. |
| `B004-icon-02` | Pending review queue | Proposals wait in an ordered review backlog. |
| `B004-icon-03` | Assigned reviewer | A specific human owns the review decision. |
| `B004-icon-04` | Review supporting evidence | Inspect sources before deciding. |
| `B004-icon-05` | Request human approval | Route a proposed action to a person. |
| `B004-icon-06` | Approve execution | A deliberate human decision opens the execution path. |
| `B004-icon-07` | Reject proposal | A review decision stops the proposed action. |
| `B004-icon-08` | Request changes | Return a proposal for revision and another review. |
| `B004-icon-09` | Delegate review | Transfer review ownership to another human. |
| `B004-icon-10` | Multiple approvals | A proposal requires agreement from more than one reviewer. |
| `B004-icon-11` | Permission boundary | An action must remain inside an explicitly permitted scope. |
| `B004-icon-12` | Sensitive action | High-impact operations need heightened authorization. |
| `B004-icon-13` | Review timeout | An unanswered approval expires rather than silently succeeding. |
| `B004-icon-14` | Escalate review | Route a blocked decision to a higher-authority reviewer. |
| `B004-icon-15` | Gated execution | Only an approved action crosses the execution boundary. |
| `B004-icon-16` | Decision audit receipt | Record the actor, decision, and action in a durable trace. |
| `B004-icon-17` | Revoke approval | Withdraw permission before a pending action executes. |
| `B004-icon-18` | Human override | A person interrupts automated execution through an explicit control. |

## C015 · Disagreement and debate

| ID | Name | Meaning |
|---|---|---|
| `C015-icon-01` | Different viewpoints | Two people see the same situation differently. |
| `C015-icon-02` | State a position | One speaker presents a clear point of view. |
| `C015-icon-03` | Listen before responding | Attend to another person without preparing a rebuttal. |
| `C015-icon-04` | Interrupting | Overlapping speech blocks an unfinished contribution. |
| `C015-icon-05` | Ask for clarification | A question opens space for understanding. |
| `C015-icon-06` | Bring evidence | Offer information that can be examined together. |
| `C015-icon-07` | Challenge an assumption | Inspect the premise beneath a confident claim. |
| `C015-icon-08` | Respectful disagreement | Express a different view without attacking the person. |
| `C015-icon-09` | Conversation heats up | Rising intensity makes the exchange harder to navigate. |
| `C015-icon-10` | Pause the discussion | Take a deliberate break instead of escalating. |
| `C015-icon-11` | Set a boundary | State a limit while remaining engaged. |
| `C015-icon-12` | Reframe the question | Change the frame to reveal another useful interpretation. |
| `C015-icon-13` | Find common ground | Identify a meaningful area of agreement. |
| `C015-icon-14` | Explore trade-offs | Recognize that each option has benefits and costs. |
| `C015-icon-15` | Negotiate a compromise | Both sides adjust to reach a workable middle. |
| `C015-icon-16` | Invite a mediator | A third person helps structure a difficult exchange. |
| `C015-icon-17` | Agree to disagree | Respectfully retain different conclusions. |
| `C015-icon-18` | Commit to a next step | End with a concrete action rather than an unresolved loop. |

## Used so far (proven)

| Concept in diagram | Icon |
|---|---|
| Signal / evidence of a pattern | `C015-icon-06` Bring evidence |
| Recency / time bands | `A052-icon-04` Appointment confirmed (calendar) |
| Value vs volume / trade-off | `C015-icon-14` Explore trade-offs (scales) |
| Dormant / lapsed / waiting | `A052-icon-10` Waiting room |
| Validate against outcomes | `B004-icon-04` Review supporting evidence |
| Holdout / gated test | `B004-icon-15` Gated execution |
| Decide / record decision | `B004-icon-16` Decision audit receipt |
| Caveats / question assumptions | `C015-icon-07` Challenge an assumption |
