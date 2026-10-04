# Little Orbit game design

## Playable learning loop

Predict → build or change the daily plan → resolve an incident → advance one turn → inspect consequences → adjust. Complete 14 Earth-day turns on a fictional lunar polar ridge or 14 approximately 24.6-hour sols on Mars. The default crew has two people. A three-person crew provides a harder replay.

Start directly at mission control with a ready lunar base. New Mission chooses destination, crew size, and a local outpost name. Returning players continue where they left off. A first-time guide explains the forecast, module construction, and daily plan before the first turn.

## Connected systems

All stocks are normalized game units. A habitat, solar array, electrolyzer, recycler, and starter greenhouse are already installed. The initial stocks are energy 72, oxygen 80, water 75, food 80, health 100; construction budget 60 credits and 20 free cargo points.

- Solar generation depends on destination and scenario illumination. Reactors generate independent of sunlight. Batteries increase energy capacity but do not generate energy.
- Habitat, electrolyzers, recyclers, gardens, and MOXIE-inspired processors compete for electricity. A power deficit reduces operating effectiveness rather than allowing full production for free.
- Oxygen generation consumes water and power. Mars-only atmospheric oxygen production consumes power but avoids the electrolyzer's water draw.
- Water recycling returns a fraction of crew use. Greenhouses consume water and power, with a short fictional maturation delay before food production.
- A storm shelter has a credit and cargo cost. Shelter reduces a scripted storm's impact; assigning the crew to shelter further reduces exposure and sacrifices science time.
- Crew consume oxygen, water, and food every turn. Stocks and health are bounded. Shortages reduce health; severe repeated shortages lead to evacuation. Rest can recover health only when life-support stocks remain available.
- Exploration earns more science but draws more resources and increases storm exposure. Research earns less science at lower consumption. Rest and shelter trade science for resilience.

## Fairness and feedback

Incidents are deterministic and described before their resolution. A forecast displays next-turn generation, demand, resource deltas, and expected health change. Event options disclose their immediate costs. Mission logs record construction, incidents, resource history, and reasons for changes. Players can recover from shortages, learn from evacuation, and replay a mission.

Success requires completing the 14-turn mission with crew health above zero; the debrief separates survival, science, and remaining reserves. Local completed missions support comparison without pretending to be a global leaderboard. Knowledge quizzes are optional and save separately.

## Educational surfaces

- Flight school: six concise linked lessons, optional questions with explanations, and classroom prompts.
- Mission log: the complete action journal, resource trend chart, local completed runs, downloadable Markdown debrief, and printable classroom report.
- Source library: challenge plus 13 NASA/JPL references, with each source's role and model limitations.
- Accessible responsive UI: semantic buttons, visible focus, keyboard dialogs, text labels accompanying color, reduced-motion support, 320-pixel mobile layout, and clearly labeled normalized units.

## Delivery

React and TypeScript browser app, built with Vite. Public GitHub repository with MIT-licensed code, live website in README and repository homepage, Vercel hosting and connected Git repository. No accounts, API keys, or database required. Persistence is confined to browser localStorage; storage errors must leave the game playable and visible to the player.
