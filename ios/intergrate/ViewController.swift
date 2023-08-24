//
//  ViewController.swift
//  intergrate
//
//  Created by 杨小龙 on 2023/8/23.
//

import UIKit
import React

class ViewController: UIViewController {
    
    var rnViewController: UIViewController!

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        let a = UIButton()
        a.frame = CGRect(x: 100, y: 100, width: 100, height: 100)
        a.backgroundColor = .red
        a.addTarget(self, action: #selector(clicks), for: .touchUpInside)
        view.addSubview(a)
    }

    @objc func clicks() {
        guard let jsCodeLocation = URL(string: "http://localhost:8081/index.ios.bundle?platform=ios") else { return  }
        
        let mockData:NSDictionary = ["scores":
                                        [
                                            ["name":"Alex", "value":"42"],
                                            ["name":"Joel", "value":"10"]
                                        ]
        ]
        
        
        rnViewController = RNManagerViewController.init(backBlock: { (backParams) in
            print(backParams)
            if backParams is Dictionary<String, String>  {
                let dict = backParams as! Dictionary<String, String>
                print("111111111111")
            }
            
        }) { (vc, nextParams) in
            print("vc=%@ \n  params=%@",vc,mockData)
        }
        
        
        let rootView = RCTRootView(
            bundleURL: jsCodeLocation,
            moduleName: "intergrate",
            initialProperties: mockData as [NSObject : AnyObject],
            launchOptions: nil
        )
        
//        rnViewController.view = rootView
//        rnViewController.title = "JS写的视图"
//        self.navigationController?.pushViewController(rnViewController, animated: true)
        view = rootView
        
    }
}

