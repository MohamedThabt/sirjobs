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

    public function scopeRole($query, ?string $role)
    {
        if (! $role) {
            return $query;
        }

        return $query->where('title', 'like', "%{$role}%");
    }

    public function scopeTags($query, ?array $tags)
    {
        if (empty($tags)) {
            return $query;
        }

        return $query->where(function ($q) use ($tags) {
            foreach ($tags as $tag) {
                $tag = trim($tag);
                if ($tag === '') {
                    continue;
                }
                $q->orWhere('tags', 'like', "%{$tag}%");
            }
        });
    }

    public function scopePostedWithinDays($query, ?int $days)
    {
        if (! $days) {
            return $query;
        }

        return $query->where('posted_at', '>=', now()->subDays($days));
    }

    public function scopePostedWithinHours($query, ?int $hours)
    {
        if (! $hours) {
            return $query;
        }

        return $query->where('posted_at', '>=', now()->subHours($hours));
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
