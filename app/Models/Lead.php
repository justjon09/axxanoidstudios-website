<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $table = 'leads';
    protected $fillable = ['name', 'email', 'company', 'service_category', 'requirements', 'quote_estimate', 'transcript', 'status'];
}