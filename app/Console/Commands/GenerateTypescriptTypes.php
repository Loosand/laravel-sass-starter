<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\TypeScriptTransformer\TypeScriptTransformer;

class GenerateTypescriptTypes extends Command
{
    protected $signature = 'types:generate';
    protected $description = 'Generate TypeScript types from PHP classes';

    public function handle(): int
    {
        $this->info('Generating TypeScript types...');

        try {
            $transformer = app(TypeScriptTransformer::class);
            $transformer->transform();

            $outputFile = config('typescript-transformer.output_file');
            
            if (file_exists($outputFile)) {
                $this->info('TypeScript types generated successfully!');
                $this->info("Output file: {$outputFile}");
            } else {
                $this->error('Output file was not created!');
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('Error generating types: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
