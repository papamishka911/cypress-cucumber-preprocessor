const ensureChain = (value: unknown): Cypress.Chainable<unknown> =>
  Cypress.isCy(value) ? value : cy.wrap(value, { log: false });

export function runStepWithLogGroup(options: {
  fn: () => unknown;
  keyword?: string;
  text: string;
}) {
  Cypress.log({
    name: options.keyword ?? "Step",
    message: `**${options.text}**`,
    groupStart: true,
  } as object);

  return ensureChain(options.fn()).then((result) => {
    Cypress.log({ groupEnd: true, emitOnly: true } as object);
    return result;
  });
}
