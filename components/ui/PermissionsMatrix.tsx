import { Icon, Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";

interface Permission {
  name: string;
  roles: string[];
}

interface PermissionCategory {
  name: string;
  permissions: Permission[];
}

interface PermissionsMatrixProps {
  roles?: string[];
  categories?: PermissionCategory[];
}

const defaultRoles = ["Owner", "Admin", "Member", "Support", "Billing"];

const defaultCategories: PermissionCategory[] = [
  {
    name: "Admin",
    permissions: [
      { name: "Manage billing", roles: ["Owner", "Billing"] },
      { name: "Create and manage environments", roles: ["Owner", "Admin"] },
      { name: "View account audit logs", roles: ["Owner", "Admin"] },
      { name: "Invite and manage account members", roles: ["Owner", "Admin"] },
      { name: "Manage account branding", roles: ["Owner", "Admin"] },
    ],
  },
  {
    name: "Core",
    permissions: [
      {
        name: "Create and manage workflows/templates",
        roles: ["Owner", "Admin", "Member"],
      },
      {
        name: "Create and manage email layouts",
        roles: ["Owner", "Admin", "Member"],
      },
      { name: "Commit and push changes", roles: ["Owner", "Admin", "Member"] },
      {
        name: "Manage users/objects/tenants",
        roles: ["Owner", "Admin", "Member"],
      },
      {
        name: "View users/objects/tenants",
        roles: ["Owner", "Admin", "Member", "Support"],
      },
      {
        name: "Manage per-tenant branding",
        roles: ["Owner", "Admin", "Member"],
      },
      {
        name: "View environment logs (API, messages)",
        roles: ["Owner", "Admin", "Member", "Support"],
      },
    ],
  },
  {
    name: "Developer",
    permissions: [
      { name: "View API keys", roles: ["Owner", "Admin", "Member"] },
      { name: "Roll API keys", roles: ["Owner", "Admin"] },
      { name: "Manage variables", roles: ["Owner", "Admin"] },
      { name: "Manage signing keys", roles: ["Owner", "Admin"] },
      { name: "Manage webhooks", roles: ["Owner", "Admin"] },
    ],
  },
];

const PermissionsMatrix = ({
  roles = defaultRoles,
  categories = defaultCategories,
}: PermissionsMatrixProps) => {
  const hasPermission = (permission: Permission, role: string): boolean => {
    return permission.roles.includes(role);
  };

  return (
    <div className="w-full mx-auto my-10">
      <table
        className="w-full border-separate border-spacing-0"
        style={{ tableLayout: "fixed" }}
      >
        {/* Roles header */}
        <thead>
          <tr className="border-b border-gray-200">
            <th
              className="w-8 px-2 py-3 border-l-0 border-t-0 border-r-0"
              style={{ width: "32px" }}
            ></th>
            <th className="px-3 py-3 border-l-0 border-t-0 border-r-0"></th>
            {roles.map((role, index) => {
              const baseWidth = `${55 / roles.length}%`; // Start with 55% of available space divided by roles

              return (
                <th
                  key={role}
                  className={`px-1 py-3 text-center font-semibold text-gray-900 text-xs border-t border-r border-gray-200 truncate ${
                    index === 0
                      ? "border-l border-gray-200 rounded-tl-md border-tl-0"
                      : ""
                  } ${
                    index === roles.length - 1
                      ? "border-r border-gray-200 rounded-tr-md border-tr-0"
                      : ""
                  }`}
                  style={{
                    width: baseWidth,
                    minWidth: "55px",
                    maxWidth: "70px",
                    borderTopLeftRadius: index === 0 ? ".375rem" : undefined,
                    borderTopRightRadius:
                      index === roles.length - 1 ? ".375rem" : undefined,
                  }}
                >
                  {role}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Categories and Permissions */}
        <tbody>
          {categories.map((category, categoryIndex) => (
            <>
              {category.permissions.map((permission, permissionIndex) => (
                <tr key={permission.name}>
                  {/* Category column - spans all rows for this category */}
                  {permissionIndex === 0 && (
                    <td
                      className={`w-8 px-4 bg-gray-100 border-r border-gray-200 relative ${
                        categoryIndex !== categories.length - 1
                          ? ""
                          : "border-b border-gray-200"
                      }`}
                      rowSpan={category.permissions.length}
                      style={{ width: "32px" }}
                    >
                      {permissionIndex === 0 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400 z-50"></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-400">
                          {category.name}
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Permission name */}
                  <td
                    className={`px-3 py-2 text-sm relative ${
                      permissionIndex === category.permissions.length - 1 &&
                      categoryIndex !== categories.length - 1
                        ? ""
                        : "border-b border-gray-200"
                    }`}
                    style={{
                      minWidth: "150px",
                    }}
                  >
                    {permissionIndex === 0 && (
                      <div className="absolute top-0 -left-px -right-px h-0.5 bg-gray-400 z-1"></div>
                    )}
                    <div className="text-gray-700 text-xs break-words leading-tight">
                      {permission.name}
                    </div>
                  </td>

                  {/* Permission checkmarks */}
                  {roles.map((role, index) => {
                    return (
                      <td
                        key={`${permission.name}-${role}`}
                        className={`px-2 py-2 text-center border-r border-gray-200 relative ${
                          index === 0 ? "border-l border-gray-200" : ""
                        } ${
                          index === roles.length - 1
                            ? "border-r border-gray-200"
                            : ""
                        } ${
                          permissionIndex === category.permissions.length - 1 &&
                          categoryIndex !== categories.length - 1
                            ? ""
                            : "border-b border-gray-200"
                        }`}
                      >
                        {permissionIndex === 0 && (
                          <div className="absolute top-0 -left-px right-0 h-0.5 bg-gray-400 z-1"></div>
                        )}
                        {hasPermission(permission, role) && (
                          <Stack
                            w="3"
                            h="3"
                            rounded="full"
                            alignItems="center"
                            justifyContent="center"
                            mx="auto"
                            style={{
                              backgroundColor: "var(--tgph-accent-9)",
                            }}
                          >
                            <Icon
                              icon={Lucide.Check}
                              color="white"
                              size="0"
                              aria-hidden={false}
                              alt="Check"
                              style={{
                                width: "90%",
                                height: "90%",
                                transform: "translateY(0.5px)",
                              }}
                            />
                          </Stack>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsMatrix;
