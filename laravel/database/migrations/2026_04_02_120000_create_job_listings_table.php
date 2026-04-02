<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->nullable()->index();
            $table->string('source')->index();             // e.g. "adzuna", "remotive", "reed_rss"
            $table->string('title');
            $table->string('company')->nullable();
            $table->string('location')->nullable()->index();
            $table->text('url');
            $table->text('description')->nullable();
            $table->string('salary')->nullable();
            $table->json('tags')->nullable();
            $table->timestamp('posted_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['source', 'external_id']);     // prevent duplicates per source
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
