<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'company' => 'sometimes|string',
            'service_category' => 'sometimes|string',
            'requirements' => 'sometimes|string',
            'quote_estimate' => 'sometimes|numeric',
            'transcript' => 'sometimes|string',
            'status' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $lead = Lead::create($request->all());

        return response()->json($lead, 201);
    }

    public function index()
    {
        return Lead::all();
    }
}