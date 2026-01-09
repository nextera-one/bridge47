import { runGenerator } from "./core/orchestrator";

console.log('Starting code generator...');

runGenerator()
  .then(() => {
    console.log('\n✅ Generation completed successfully!');
    process.exit(0);
  })
  .catch((error:any) => {
    console.error("\n❌ The generator encountered a fatal error:", error);
    process.exit(1);
  });