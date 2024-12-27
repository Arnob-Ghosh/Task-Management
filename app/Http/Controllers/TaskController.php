<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user()->id;

        $dueDate = $request->query('due_date');

        $query = Task::where('created_by', $user);

        $tasks = $query->get();

        return response()->json(['message' => 'Tasks Found', 'tasks' => $tasks], 200);
    }
    public function store(TaskRequest $request, $id = null)
    {
        if ($id) {
            $task = Task::findOrFail($id); 
            $validated = $request->validated(); // Validate the request
            $task->update($validated); // Update the task with validated data
            return response()->json(['message' => 'Task updated successfully!', 'task' => $task], 200);
        } else {
            $validated = $request->validated();
            $validated['created_by'] = Auth::user()->id;
    
            $task = Task::create($validated); // Create a new task
            return response()->json(['message' => 'Task created successfully!', 'task' => $task], 201);
        }
    }


    public function destroy($id)
    {
        $task = Task::findOrFail($id);
    
        // Delete the task
        $task->delete();
    
        return response()->json(['message' => 'Task deleted successfully!'], 200);
    }
}
