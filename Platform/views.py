from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.views.decorators import csrf
from django.views.generic import View
from rest_framework.views import APIView
from rest_framework.response import Response
from . import work, dp_ts, dp_ucb
from django.views.decorators.csrf import csrf_exempt, requires_csrf_token
import numpy as np
import json


def HomeView(request):
    
    return render(request, 'home.html')

def ThompsonView(request):
    return render(request, 'thompson.html')

    
class RunView(View):
    def get(self, request, *args, **kwargs):
        name = "this_model"
        val = 1
        return render(request, 'run.html', {"name": name, "val": val})

class ChartDataThompson(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request, format = None):
        print(request.POST)
        req_data = json.dumps(request.POST)
        req_data = json.loads(req_data)

        # getting for function
        num_items = int(req_data["num_items"])
        num_prices = int(req_data["num_prices"])
        time_h = int(req_data["time_h"])
        noise_var = float(req_data["noise_var"])
        initial_prices = work.process_string(1, num_items, num_prices, req_data["initial_prices"])
        initial_elasticity = work.process_string(1, num_items, num_prices, req_data["initial_elasticity"])
        initial_demand = work.process_string(1, num_items, num_prices, req_data["initial_demands"])
        constraint_set = work.process_string(2, num_items, num_prices, req_data["constraint_set"])
        

        labels, chartdata = dp_ts.run_ts(initial_prices, initial_demand, initial_elasticity, time_h, noise_var, constraint_set, num_items)
        chartLabel = "Revenue Generated Per Day"
        data ={
                     "labels":labels,
                     "chartLabel":chartLabel,
                     "chartdata":chartdata,
             }
        return Response(data)

def UCBView(request):
    return render(request, 'ucb.html')


class ChartDataUCB(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request, format = None):
        
        req_data = json.dumps(request.POST)
        req_data = json.loads(req_data)
        print(req_data)
        # getting for function
        num_prices = int(req_data["num_prices"])
        time_h = int(req_data["time_h"])
        initial_prices = work.process_string(1, num_prices, 1, req_data["initial_prices"])
        mu_max = float(req_data["mu_max"])
        algo = req_data["algo"].strip('"')
        print(initial_prices, algo, type(algo), type(initial_prices))
        labels = np.arange(1, time_h+1, 1)
        chartdata = None
        chartrevenue = None

        if algo == "ucbo":
            print("Runnning UCBO")
            chartdata, chartrevenue = dp_ucb.ucbo(time_h, mu_max, initial_prices, num_prices)
        elif algo == "ucbp":
            print("Runnning UCBP")
            chartdata, chartrevenue = dp_ucb.ucbp(time_h, mu_max, initial_prices, num_prices)
        elif algo == "ucbpo":
            print("Runnning UCBPO")
            chartdata, chartrevenue = dp_ucb.ucbpo(time_h, mu_max, initial_prices, num_prices)

        # labels, chartdata = dp_ts.run_ts(initial_prices, initial_demand, initial_elasticity, time_h, noise_var, constraint_set, num_items)
        chartLabel = "Regret Per Day"
        data ={
                     "labels":labels,
                     "chartLabel":chartLabel,
                     "chartdata":chartdata,
                     "chartrevenue": chartrevenue
             }
        return Response(data)
