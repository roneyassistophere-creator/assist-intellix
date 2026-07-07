import * as migration_20260702_121508_initial from './20260702_121508_initial';
import * as migration_20260705_065851_add_automation_requests from './20260705_065851_add_automation_requests';
import * as migration_20260705_073920_add_wants_plan_and_attachments from './20260705_073920_add_wants_plan_and_attachments';
import * as migration_20260707_050129_add_source_to_automation_requests from './20260707_050129_add_source_to_automation_requests';

export const migrations = [
  {
    up: migration_20260702_121508_initial.up,
    down: migration_20260702_121508_initial.down,
    name: '20260702_121508_initial',
  },
  {
    up: migration_20260705_065851_add_automation_requests.up,
    down: migration_20260705_065851_add_automation_requests.down,
    name: '20260705_065851_add_automation_requests',
  },
  {
    up: migration_20260705_073920_add_wants_plan_and_attachments.up,
    down: migration_20260705_073920_add_wants_plan_and_attachments.down,
    name: '20260705_073920_add_wants_plan_and_attachments',
  },
  {
    up: migration_20260707_050129_add_source_to_automation_requests.up,
    down: migration_20260707_050129_add_source_to_automation_requests.down,
    name: '20260707_050129_add_source_to_automation_requests'
  },
];
