import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

import { UserRole } from "@/generated/prisma/enums";

const statements = {
  ...defaultStatements,
  posts: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

// access control
export const ac = createAccessControl(statements);

// define role specific access control
export const roles = {
  [UserRole.USER]: ac.newRole({
    posts: ["create", "update:own", "read", "delete:own"],
  }),
  [UserRole.ADMIN]: ac.newRole({
    ...adminAc.statements,
    posts: ["create", "read", "update", "delete", "update:own", "delete:own"],
  }),
};
