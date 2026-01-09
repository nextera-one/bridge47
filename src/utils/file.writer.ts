import sqlPlugin from 'prettier-plugin-sql';
import * as prettier from 'prettier';
import * as path from 'path';
import * as fs from 'fs';

type ParserType = 'typescript' | 'sql' | 'vue' | 'json';

interface WriteOptions {
  /** Create a backup of existing file before overwriting */
  backup?: boolean;
  /** Skip writing if content is unchanged */
  skipUnchanged?: boolean;
  /** Dry run mode - only log what would be written */
  dryRun?: boolean;
}

// Track statistics for generation summary
export const writeStats = {
  created: 0,
  updated: 0,
  skipped: 0,
  errors: 0,
  
  reset() {
    this.created = 0;
    this.updated = 0;
    this.skipped = 0;
    this.errors = 0;
  },
  
  getSummary() {
    return `📊 Summary: ${this.created} created, ${this.updated} updated, ${this.skipped} skipped, ${this.errors} errors`;
  }
};

/**
 * Writes content to a file with formatting, optional backup, and diff detection.
 * @param folderPath - The target folder path
 * @param fileName - The name of the file to create/update
 * @param content - The content to write
 * @param parser - The prettier parser to use (default: 'typescript')
 * @param options - Additional write options
 */
export async function writeAndFormat(
  folderPath: string,
  fileName: string,
  content: string,
  parser: ParserType = 'typescript',
  options: WriteOptions = { skipUnchanged: true }
): Promise<void> {
  const fullPath = path.join(folderPath, fileName);
  
  try {
    // Format the content with prettier
    const plugins = parser === 'sql' ? [sqlPlugin] : [];
    const formattedContent = await prettier.format(content, { 
      parser, 
      plugins,
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 100,
    });
    
    // Check if file already exists
    const fileExists = fs.existsSync(fullPath);
    
    if (fileExists && options.skipUnchanged) {
      const existingContent = fs.readFileSync(fullPath, 'utf8');
      if (existingContent === formattedContent) {
        writeStats.skipped++;
        return; // Skip writing unchanged file
      }
    }
    
    // Dry run mode - just log what would happen
    if (options.dryRun) {
      const action = fileExists ? 'UPDATE' : 'CREATE';
      console.log(`  [DRY-RUN] Would ${action}: ${fullPath}`);
      return;
    }
    
    // Create backup if requested and file exists
    if (fileExists && options.backup) {
      const backupPath = `${fullPath}.bak`;
      fs.copyFileSync(fullPath, backupPath);
    }
    
    // Ensure directory exists
    fs.mkdirSync(folderPath, { recursive: true });
    
    // Write the file
    fs.writeFileSync(fullPath, formattedContent);
    
    if (fileExists) {
      writeStats.updated++;
    } else {
      writeStats.created++;
    }
    
  } catch (error) {
    writeStats.errors++;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Error writing ${fullPath}: ${errorMessage}`);
    
    // Re-throw to allow caller to handle if needed
    throw new Error(`Failed to write ${fileName}: ${errorMessage}`);
  }
}

/**
 * Reads an existing file's content or returns null if it doesn't exist.
 * @param filePath - The full path to the file
 * @returns The file content or null
 */
export function readFileIfExists(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}