const severityOrder = Object.freeze({ ERROR: 0, WARNING: 1, INFO: 2 });

export class DiagnosticBag {
  #items = [];

  error(code, message, file = '') {
    this.#add('ERROR', code, message, file);
  }

  warning(code, message, file = '') {
    this.#add('WARNING', code, message, file);
  }

  info(code, message, file = '') {
    this.#add('INFO', code, message, file);
  }

  #add(severity, code, message, file) {
    this.#items.push({ severity, code, message, file: normalizePath(file) });
  }

  get items() {
    return [...this.#items].sort(compareDiagnostics);
  }

  get errors() {
    return this.items.filter((item) => item.severity === 'ERROR');
  }

  get warnings() {
    return this.items.filter((item) => item.severity === 'WARNING');
  }

  get infos() {
    return this.items.filter((item) => item.severity === 'INFO');
  }

  get hasErrors() {
    return this.#items.some((item) => item.severity === 'ERROR');
  }

  format() {
    return this.items
      .map(({ severity, code, message, file }) => {
        const location = file ? `${file}: ` : '';
        return `[${severity}] ${code} ${location}${message}`;
      })
      .join('\n');
  }
}

export class ContentValidationError extends Error {
  constructor(diagnostics) {
    super(`Content validation failed with ${diagnostics.errors.length} error(s).\n${diagnostics.format()}`);
    this.name = 'ContentValidationError';
    this.diagnostics = diagnostics.items;
  }
}

function compareDiagnostics(left, right) {
  return (
    severityOrder[left.severity] - severityOrder[right.severity] ||
    left.file.localeCompare(right.file) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message)
  );
}

function normalizePath(value) {
  return String(value ?? '').replaceAll('\\', '/');
}
