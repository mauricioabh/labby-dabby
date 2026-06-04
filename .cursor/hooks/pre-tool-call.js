const command = process.env.CURSOR_TOOL_INPUT || '';
const filePath = process.env.CURSOR_FILE_PATH || '';

const BLOCKED_COMMANDS = [
  'rm -rf',
  'DROP TABLE',
  'DROP DATABASE',
  'DELETE FROM',
  'git reset --hard',
  'git clean -fd',
  'truncate',
];

const REQUIRE_APPROVAL_FILES = [
  'schema.ts',
  'middleware.ts',
  'proxy.ts',
  'drizzle.config.ts',
  'apps/web/public/',
  'packages/ui/',
];

const isBlockedCommand = BLOCKED_COMMANDS.some((cmd) =>
  command.toLowerCase().includes(cmd.toLowerCase())
);

const requiresApproval = REQUIRE_APPROVAL_FILES.some((file) =>
  filePath.includes(file)
);

if (isBlockedCommand) {
  console.error(
    `🚨 BLOQUEADO: Comando de alto riesgo detectado: "${command}"\n` +
      `Solicita aprobación explícita del usuario antes de continuar.`
  );
  process.exit(1);
}

if (requiresApproval) {
  console.warn(
    `⚠️ ATENCIÓN: Estás a punto de modificar un archivo crítico: "${filePath}"\n` +
      `Confirma con el usuario antes de proceder.`
  );
}
