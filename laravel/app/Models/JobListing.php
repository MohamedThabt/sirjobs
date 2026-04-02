<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    protected $fillable = [
        'external_id',
        'source',
        'title',
        'company',
        'location',
        'url',
        'description',
        'salary',
        'tags',
        'posted_at',
    ];

    protected function casts(): array
    {
        return [
            'tags'      => 'array',
            'posted_at' => 'datetime',
        ];
    }

    /**
     * Scope: filter by search keyword (matches title, company, or description).
     */
    public function scopeSearch($query, ?string $keyword)
    {
        if (! $keyword) {
            return $query;
        }

        return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
              ->orWhere('company', 'like', "%{$keyword}%")
              ->orWhere('description', 'like', "%{$keyword}%");
        });
    }

    /**
     * Scope: filter by location (supports "remote" keyword).
     */
    public function scopeLocation($query, ?string $location)
    {
        if (! $location) {
            return $query;
        }

        return $query->where('location', 'like', "%{$location}%");
    }

    /**
     * Scope: filter by source array.
     */
    public function scopeSource($query, ?array $sources)
    {
        if (empty($sources)) {
            return $query;
        }

        return $query->whereIn('source', $sources);
    }

    /**
     * Scope: filter explicitly by remote.
     */
    public function scopeRemoteOnly($query, bool $isRemote)
    {
        if (! $isRemote) {
            return $query;
        }

        return $query->where(function ($q) {
            $q->where('location', 'like', '%remote%')
              ->orWhere('tags', 'like', '%remote%')
              ->orWhere('title', 'like', '%remote%');
        });
    }
}
