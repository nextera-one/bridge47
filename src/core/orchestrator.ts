import { generateAuditEntity } from '../templates/audit-entity.template';
import { generateTableColumn } from '../templates/table-column.template';
import { generateAppModule } from '../templates/app-module.template';
import { generateController } from '../templates/controller.template';
import { generateSubscriber } from '../templates/subscriber.template';
import { generateFunctions } from '../templates/functions.template';
import { generateAuditTableSQL } from '../templates/sql-audit.template';
import { generateService } from '../templates/service.template';
import { generateEntity } from '../templates/entity.template';
import { generateModule } from '../templates/module.template';
import { generateModel } from '../templates/model.template';
import { generateBase } from '../templates/base.template';
import { generateMain } from '../templates/main.template';
import { SchemaReader } from '../database/schema.reader';
import { createEnums, generateDTO } from '../templates/dto.template';
import { generateVue } from '../templates/vue.template';
import GeneratorHelper from '../utils/generator.helper';
import { writeAndFormat, writeStats } from '../utils/file.writer';
import { config } from '../generator.config';

export async function runGenerator() {
  const schemaReader = new SchemaReader();
  const auditSqlStatements: string[] = [];
  const moduleNames = config.tables.map(t => t.table);
  const totalTables = config.tables.length;
  let currentTable = 0;
  
  // Reset write statistics
  writeStats.reset();

  try {
    await schemaReader.connect();

    for (const tableConfig of config.tables) {
      const { table, global } = tableConfig;
      currentTable++;
      console.log(`\n[${currentTable}/${totalTables}] Processing table: ${table}`);

      const schema = await schemaReader.getTableSchema(table);
      const backendModulePath = `${config.paths.backend}/${table}`;
      const frontendModulePath = `${config.paths.frontend}/${GeneratorHelper.snakeToKebabCase(table)}`;

      if (config.generate.dto || config.generate.entity) {
        const enums = createEnums(table, schema.columns);
        if (enums.size > 0) {
            console.log(`  -> Generating enums...`);
            const enumsPath = `${backendModulePath}/enums`;
            for (const [name, content] of enums) {
                await writeAndFormat(enumsPath, `${name}.enum.ts`, content);
            }
        }
      }

      if (config.generate.dto) {
        console.log(`  -> Generating DTOs...`);
        const { createDto, readDto, updateDto } = generateDTO(table, schema.columns);
        const dtoPath = `${backendModulePath}/dto`;
        await writeAndFormat(dtoPath, `create-${table}.dto.ts`, createDto);
        await writeAndFormat(dtoPath, `read-${table}.dto.ts`, readDto);
        await writeAndFormat(dtoPath, `update-${table}.dto.ts`, updateDto);
      }
      
      if (config.generate.entity) {
          console.log(`  -> Generating entity...`);
          const content = await generateEntity(table, schema);
          await writeAndFormat(`${backendModulePath}/entities`, `${table}.entity.ts`, content);
      }
      
      if (config.generate.auditEntity) {
          console.log(`  -> Generating audit entity...`);
          const content = generateAuditEntity(table);
          await writeAndFormat(`${backendModulePath}/entities`, `${table}.audit.entity.ts`, content);
      }

      if (config.generate.subscriber) {
          console.log(`  -> Generating subscriber...`);
          const content = generateSubscriber(table);
          await writeAndFormat(`${backendModulePath}/subscribers`, `${table}.subscriber.ts`, content);
      }

      if (config.generate.service) {
          console.log(`  -> Generating service...`);
          const content = generateService(table);
          await writeAndFormat(backendModulePath, `${table}.service.ts`, content);
      }
      
      if (config.generate.controller) {
          console.log(`  -> Generating controller...`);
          const content = generateController(table, config.version);
          await writeAndFormat(backendModulePath, `${table}.controller.ts`, content);
      }

      if (config.generate.module) {
          console.log(`  -> Generating module...`);
          const content = generateModule(table, global);
          await writeAndFormat(backendModulePath, `${table}.module.ts`, content);
      }

      if (config.generate.model) {
          console.log(`  -> Generating frontend model...`);
          const content = generateModel(table, schema.columns);
          await writeAndFormat(`${frontendModulePath}/model`, `${GeneratorHelper.snakeToPascal(table)}.model.ts`, content);
      }

      if (config.generate.vue) {
          console.log(`  -> Generating vue component...`);
          const content = generateVue(table, schema.columns);
          await writeAndFormat(`${frontendModulePath}/vue`, `${GeneratorHelper.snakeToPascal(table)}Page.vue`, content, 'vue');
      }

      if (config.generate.func) {
          console.log(`  -> Generating frontend functions...`);
          const content = generateFunctions(table);
          await writeAndFormat(frontendModulePath, `${GeneratorHelper.snakeToPascal(table)}.func.ts`, content);
      }
      
      if (config.generate.sqlAuditTables) {
          const sql = generateAuditTableSQL(table, schema.columns);
          auditSqlStatements.push(sql);
      }
    }

    if (config.generate.main) {
        console.log("\nGenerating main.ts...");
        const content = generateMain();
        await writeAndFormat(config.paths.backend, 'main.ts', content);
    }
    
    if (config.generate.appModule) {
        console.log("Generating app.module.ts...");
        const content = generateAppModule(moduleNames);
        await writeAndFormat(config.paths.backend, 'app.module.ts', content);
    }

    if (config.generate.model || config.generate.func) {
        console.log("\nGenerating frontend base files...");
        const { baseModel, baseFunc } = generateBase();
        const basePath = `${config.paths.frontend}/base`;
        await writeAndFormat(basePath, 'Base.model.ts', baseModel);
        await writeAndFormat(basePath, 'Base.func.ts', baseFunc);        
    }

    if (config.generate.tableColumn) {
        console.log("Generating frontend TableColumn model...");
        const content = generateTableColumn();
        await writeAndFormat(`${config.paths.frontend}/base`, 'TableColumn.model.ts', content);
    }

    if (config.generate.sqlAuditTables && auditSqlStatements.length > 0) {
        console.log("\nGenerating audit_tables.sql...");
        await writeAndFormat(config.paths.sql, 'audit_tables.sql', auditSqlStatements.join('\n\n'), 'sql');
    }
    
    // Print generation summary
    console.log(`\n${writeStats.getSummary()}`);

  } catch (error) {
    console.error("An error occurred during generation:", error);
    throw error;
  } finally {
    await schemaReader.disconnect();
  }
}