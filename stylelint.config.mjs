export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: [".next/**", "node_modules/**"],
  rules: {
    "selector-class-pattern": "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$",
    "custom-property-pattern": "^(?!(border-shell|border-ui)$)[a-z][a-z0-9]*(?:-[a-z0-9]+)*$",
    "declaration-property-value-disallowed-list": {
      "/.*/": [
        /var\(--border-shell\)/,
        /var\(--border-ui\)/,
        /4px\s+solid\s+var\(--text-primary\)/,
      ],
    },
    "no-descending-specificity": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "declaration-no-important": null,
  },
};
